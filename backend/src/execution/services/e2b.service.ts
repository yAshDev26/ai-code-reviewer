import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Sandbox } from 'e2b';
import { ExecutionResult } from '../interfaces/execution.interfaces';
import { SUPPORTED_LANGUAGES } from '../../common/constants/languages';

interface LangConfig {
  fileName: string;
  buildRunCommand: () => string;
}

const LANGUAGE_CONFIG: Record<string, LangConfig> = {
  javascript: { fileName: 'main.js', buildRunCommand: () => 'node main.js' },
  typescript: { fileName: 'main.ts', buildRunCommand: () => 'npx -y tsx main.ts' },
  python: { fileName: 'main.py', buildRunCommand: () => 'python3 main.py' },
  java: { fileName: 'Main.java', buildRunCommand: () => 'javac Main.java && java Main' },
  cpp: { fileName: 'main.cpp', buildRunCommand: () => 'g++ main.cpp -o main_exec && ./main_exec' },
  go: { fileName: 'main.go', buildRunCommand: () => 'go run main.go' },
};

@Injectable()
export class E2BService {
  private readonly logger = new Logger(E2BService.name);

  constructor(private readonly configService: ConfigService) {}

  private getApiKey(): string {
    const key = this.configService.get<string>('E2B_API_KEY');
    if (!key) {
      throw new BadRequestException(
        'Execution service is not configured. Missing E2B_API_KEY in backend .env',
      );
    }
    return key;
  }

  async execute(
    code: string,
    language: string,
    stdin?: string,
  ): Promise<ExecutionResult> {
    const config = LANGUAGE_CONFIG[language];
    if (!config) {
      throw new BadRequestException(
        `Execution not supported for language: ${language}. Supported: ${SUPPORTED_LANGUAGES.join(', ')}`
      );
    }

    const apiKey = this.getApiKey();
    const startTime = Date.now();
    let sandbox: Sandbox | null = null;

    try {
        sandbox = await Sandbox.create({ apiKey, timeoutMs: 30000 });

        await sandbox.files.write(config.fileName, code);

        let command = config.buildRunCommand();
        if (stdin) {
        await sandbox.files.write('input.txt', stdin);
        command = `${command} < input.txt`;
        }

        const result = await sandbox.commands.run(command, {
        timeoutMs: 15000,
        cwd: '/home/user',
        });

        const executionTimeMs = Date.now() - startTime;
        const exitCode = result.exitCode ?? 0;

        return {
        stdout: result.stdout || '',
        stderr: result.stderr || '',
        exitCode,
        executionTimeMs,
        success: exitCode === 0,
        compileError: null,
        };
    } catch (err: any) {
      const executionTimeMs = Date.now() - startTime;

      const hasPartialResult =
        typeof err.stdout === 'string' ||
        typeof err.stderr === 'string' ||
        typeof err.exitCode === 'number' ||
        typeof err.result?.stdout === 'string';

      if (hasPartialResult) {
        // This is a NORMAL outcome — the user's code crashed/errored at runtime.
        // Not a system failure, so we just log it quietly for visibility.
        this.logger.log(
          `Program exited with non-zero code (expected for crashing code): exitCode=${err.result?.exitCode ?? err.exitCode}`,
        );

        return {
          stdout: err.stdout ?? err.result?.stdout ?? '',
          stderr: err.stderr ?? err.result?.stderr ?? err.message ?? '',
          exitCode:
            typeof err.exitCode === 'number'
              ? err.exitCode
              : typeof err.result?.exitCode === 'number'
              ? err.result.exitCode
              : 1,
          executionTimeMs,
          success: false,
          compileError: null,
        };
      }

      // Only log loudly + throw for genuinely unexpected failures
      this.logger.error(`E2B execution failed unexpectedly: ${err.message}`);

      if (err.message?.toLowerCase().includes('timeout')) {
        return {
          stdout: '',
          stderr: 'Execution timed out (possible infinite loop).',
          exitCode: -1,
          executionTimeMs,
          success: false,
          compileError: null,
        };
      }

      throw new BadRequestException(`Code execution failed: ${err.message}`);
    } finally {
        if (sandbox) {
        try {
            await sandbox.kill();
        } catch {
            // ignore cleanup errors
        }
        }
      }
    }
}