import { resolve } from 'node:path'
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs'
import { globby } from 'globby'
import matter from 'gray-matter'
import type { Plugin as VitePlugin } from 'vite'

export interface LLMsPluginOptions {
  /**
   * Output directory for llms.txt files
   * @default 'dist'
   */
  outDir?: string
  /**
   * Base path for the site
   * @default '/'
   */
  basePath?: string
  /**
   * Site title
   * @default 'Documentation'
   */
  title?: string
  /**
   * Site description
   */
  description?: string
  /**
   * Root directory containing markdown files
   * @default process.cwd()
   */
  rootDir?: string
  /**
   * Patterns to exclude from processing
   * @default ['node_modules/**', 'README.md']
   */
  exclude?: string[]
}

export function llmsPlugin(options: LLMsPluginOptions = {}): VitePlugin {
  const {
    outDir = 'dist',
    basePath = '/',
    title = 'Documentation',
    description,
    rootDir = process.cwd(),
    exclude = ['**/node_modules/**', '**/.*/**', '**/README.md']
  } = options

  let viteConfig: { build?: { outDir?: string } }

  return {
    name: 'vitepress-llms-plugin',
    configResolved(config) {
      viteConfig = config
    },
    async buildStart() {
      await generateLLMsFiles()
    },
    async handleHotUpdate(ctx) {
      // Regenerate on markdown file changes in dev mode
      if (ctx.file.endsWith('.md')) {
        await generateLLMsFiles()
      }
    },
    configureServer(server) {
      // Serve llms.txt files in dev mode
      server.middlewares.use('/llms.txt', (req, res) => {
        const llmsPath = resolve(process.cwd(), 'dist', 'llms.txt')
        if (existsSync(llmsPath)) {
          res.setHeader('Content-Type', 'text/plain')
          res.end(readFileSync(llmsPath, 'utf-8'))
        } else {
          res.statusCode = 404
          res.end('llms.txt not found')
        }
      })
      
      server.middlewares.use('/llms-full.txt', (req, res) => {
        const llmsPath = resolve(process.cwd(), 'dist', 'llms-full.txt')
        if (existsSync(llmsPath)) {
          res.setHeader('Content-Type', 'text/plain')
          res.end(readFileSync(llmsPath, 'utf-8'))
        } else {
          res.statusCode = 404
          res.end('llms-full.txt not found')
        }
      })
    }
  }

  async function generateLLMsFiles() {
    try {
      const actualOutDir = viteConfig?.build?.outDir || outDir
      
      // Ensure output directory exists
      if (!existsSync(actualOutDir)) {
        mkdirSync(actualOutDir, { recursive: true })
      }

      // Build content arrays with metadata
      const content = [
        `# ${title} LLM Guide`,
        `llms.txt for https://docs.getoptimum.xyz/`,
        `version: 1.0`,
        `attribution: Required`,
        `attribution_url: https://docs.getoptimum.xyz/`,
        '',
        '# Crawl settings',
        'crawl_delay: 1',
        'allow_paths:',
        '  - /',
        'disallow_paths:',
        '  - /private/',
        '  - /drafts/',
        'sitemaps:',
        '  - https://docs.getoptimum.xyz/sitemap.xml',
        '',
        '## Site Overview',
        description || 'Official documentation for Optimum - the world\'s first high-performance memory infrastructure for any blockchain.',
        '',
        '## llms-full.txt',
        '',
        'For a complete text version of all documentation pages, use https://docs.getoptimum.xyz/llms-full.txt',
        ''
      ]

      // Find all markdown files
      const patterns = [
        `${rootDir}/**/*.md`,
        `!${rootDir}/node_modules/**`,
        `!${rootDir}/.*/**`,
        ...exclude.map((pattern: string) => `!${rootDir}/${pattern}`)
      ]

      const files = await globby(patterns)
      
      // Content for llms.txt (index format)
      const llmsTxtContent = [...content, '## Documentation', '']
      
      // Content for llms-full.txt (full content)
      const llmsFullContent = [...content]

      for (const file of files.sort()) {
        try {
          const fileContent = readFileSync(file, 'utf-8')
          const { data: frontmatter, content: markdownContent } = matter(fileContent)
          
          // Generate relative path for URL
          let relativePath = file.replace(rootDir, '').replace(/\\/g, '/')
          if (relativePath.startsWith('/')) {
            relativePath = relativePath.substring(1)
          }
          
          // Convert file path to URL path
          let urlPath = relativePath.replace(/\.md$/, '')
          if (urlPath.endsWith('/index')) {
            urlPath = urlPath.replace('/index', '')
          }
          if (urlPath === 'index') {
            urlPath = ''
          }
          
          // Skip if this is the main index file and it's just frontmatter
          if (urlPath === '' && markdownContent.trim().length < 50) {
            continue
          }

          const fullUrl = basePath === '/' ? `/${urlPath}` : `${basePath}/${urlPath}`
          
          // Extract title from frontmatter or first heading
          const pageTitle = frontmatter.title || extractTitleFromMarkdown(markdownContent) || 'Untitled'
          
          // Extract description
          const pageDescription = frontmatter.description || extractDescriptionFromMarkdown(markdownContent)
          
          // Add to index format (llms.txt)
          const indexEntry = pageDescription 
            ? `- [${pageTitle}](${fullUrl}): ${pageDescription}`
            : `- [${pageTitle}](${fullUrl})`
          llmsTxtContent.push(indexEntry)
          
          // Add to full content format (llms-full.txt)
          llmsFullContent.push(
            `## ${pageTitle}`,
            '',
            `**URL:** ${fullUrl}`,
            '',
            processMarkdownContent(markdownContent),
            '',
            '---',
            ''
          )
        } catch (error) {
          console.warn(`Warning: Could not process file ${file}:`, error)
        }
      }

      // Write files
      const llmsTxtPath = resolve(actualOutDir, 'llms.txt')
      const llmsFullTxtPath = resolve(actualOutDir, 'llms-full.txt')
      
      writeFileSync(llmsTxtPath, llmsTxtContent.join('\n'))
      writeFileSync(llmsFullTxtPath, llmsFullContent.join('\n'))
      
      console.log(`✅ Generated LLM files:`)
      console.log(`   📄 ${llmsTxtPath}`)
      console.log(`   📄 ${llmsFullTxtPath}`)
      
    } catch (error) {
      console.error('Error generating LLM files:', error)
    }
  }
}

function extractTitleFromMarkdown(content: string): string | null {
  // Look for first # heading
  const headingMatch = content.match(/^#\s+(.+)$/m)
  if (headingMatch) {
    return headingMatch[1].trim()
  }
  
  // Look for any heading
  const anyHeadingMatch = content.match(/^#+\s+(.+)$/m)
  if (anyHeadingMatch) {
    return anyHeadingMatch[1].trim()
  }
  
  return null
}

function extractDescriptionFromMarkdown(content: string): string | null {
  // Remove frontmatter and headings, get first paragraph
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---/, '').trim()
  const withoutHeadings = withoutFrontmatter.replace(/^#+\s+.+$/gm, '').trim()
  
  // Get first paragraph
  const paragraphs = withoutHeadings.split('\n\n')
  const firstParagraph = paragraphs.find(p => p.trim().length > 0)
  
  if (firstParagraph && firstParagraph.length > 10) {
    // Clean up markdown formatting and limit length
    const cleaned = firstParagraph
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
      .replace(/[*_`]/g, '') // Remove formatting
      .replace(/\n/g, ' ') // Replace newlines with spaces
      .trim()
    
    return cleaned.length > 150 ? cleaned.substring(0, 147) + '...' : cleaned
  }
  
  return null
}

function processMarkdownContent(content: string): string {
  // Remove frontmatter
  const withoutFrontmatter = content.replace(/^---[\s\S]*?---/, '').trim()
  
  // Clean up the content but preserve structure
  return withoutFrontmatter
    .replace(/\n{3,}/g, '\n\n') // Reduce multiple newlines
    .trim()
}