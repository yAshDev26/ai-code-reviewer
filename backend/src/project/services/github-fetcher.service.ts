import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { EXTENSION_MAP } from '../../common/constants/languages'; // ← replaces inline map

interface GithubFile {
  path: string;
  content: string;
  language: string;
}

const SKIP_DIRS = ['node_modules', '.git', 'dist', 'build', '__pycache__'];

@Injectable()
export class GithubFetcherService {
  private readonly maxFiles = 5;

  async fetchRepoFiles(repoUrl: string): Promise<GithubFile[]> {
    const { owner, repo } = this.parseRepoUrl(repoUrl);
    const files: GithubFile[] = [];
    await this.walkDirectory(owner, repo, '', files);
    return files.slice(0, this.maxFiles);
  }

  private parseRepoUrl(url: string): { owner: string; repo: string } {
    const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!match) {
      throw new BadRequestException('Invalid GitHub repository URL.');
    }
    return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
  }

  private async walkDirectory(
    owner: string,
    repo: string,
    path: string,
    files: GithubFile[],
  ): Promise<void> {
    if (files.length >= this.maxFiles) return;

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
    let items;
    try {
      const response = await axios.get(url, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      });
      items = response.data;
    } catch {
      throw new BadRequestException(
        'Could not fetch repository. Make sure it is public and the URL is correct.',
      );
    }

    if (!Array.isArray(items)) return;

    for (const item of items) {
      if (files.length >= this.maxFiles) break;

      if (item.type === 'file') {
        const ext = item.name.split('.').pop()?.toLowerCase() || '';
        const language = EXTENSION_MAP[ext]; // ← uses shared constant
        if (!language) continue;
        if (item.size > 100000) continue;

        try {
          const fileResponse = await axios.get(item.url, {
            headers: { Accept: 'application/vnd.github.v3+json' },
          });
          const content = Buffer.from(
            fileResponse.data.content,
            'base64',
          ).toString('utf-8');
          files.push({ path: item.path, content, language });
        } catch {
          continue;
        }
      } else if (item.type === 'dir') {
        if (SKIP_DIRS.includes(item.name)) continue;
        await this.walkDirectory(owner, repo, item.path, files);
      }
    }
  }
}