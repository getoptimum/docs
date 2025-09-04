<template>
  <div class="llm-dropdown">
                <button
              class="llm-dropdown-button"
              @click="toggleDropdown"
              :class="{ active: isOpen }"
              aria-label="Copy page"
            >
              <span>Copy page</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" :class="{ 'rotate-180': isOpen }">
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
              </svg>
            </button>
    
    <Transition name="dropdown">
      <div v-if="isOpen" class="llm-dropdown-menu">
        <a 
          :href="claudeUrl" 
          target="_blank" 
          class="llm-dropdown-item"
          @click="closeDropdown"
        >
                            <div class="llm-item-icon claude-icon">
                    <img src="/claude-light.svg" alt="Claude" width="18" height="18" class="light-logo" />
                    <img src="/claude-dark.svg" alt="Claude" width="18" height="18" class="dark-logo" />
                  </div>
          <div class="llm-item-content">
            <span class="llm-item-title">Ask Claude</span>
            <span class="llm-item-desc">Open this page in Claude</span>
          </div>
          <div class="llm-item-arrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 7h8.586L5.293 17.293l1.414 1.414L17 8.414V17h2V5H7v2z"/>
            </svg>
          </div>
        </a>
        
        <a 
          :href="chatGPTUrl" 
          target="_blank" 
          class="llm-dropdown-item"
          @click="closeDropdown"
        >
                            <div class="llm-item-icon chatgpt-icon">
                    <img src="/chatgpt-light.svg" alt="ChatGPT" width="18" height="18" class="light-logo" />
                    <img src="/chatgpt-dark.svg" alt="ChatGPT" width="18" height="18" class="dark-logo" />
                  </div>
          <div class="llm-item-content">
            <span class="llm-item-title">Ask ChatGPT</span>
            <span class="llm-item-desc">Open this page in ChatGPT</span>
          </div>
          <div class="llm-item-arrow">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 7h8.586L5.293 17.293l1.414 1.414L17 8.414V17h2V5H7v2z"/>
            </svg>
          </div>
        </a>
        
        <button 
          class="llm-dropdown-item"
          @click="copyPageAsMarkdown"
        >
                            <div class="llm-item-icon copy-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                  </div>
          <div class="llm-item-content">
            <span class="llm-item-title">Copy as markdown</span>
            <span class="llm-item-desc">Copy page as plaintext</span>
          </div>
        </button>
        
        <div class="llm-dropdown-divider"></div>
        
        <div class="llm-dropdown-buttons">
          <a 
            :href="llmsTxtUrl" 
            target="_blank" 
            class="llm-button"
            @click="closeDropdown"
          >
            llms.txt
          </a>
          <a 
            :href="llmsFullTxtUrl" 
            target="_blank" 
            class="llm-button"
            @click="closeDropdown"
          >
            llms-full.txt
          </a>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useData } from 'vitepress'

const isOpen = ref(false)
const { page, site } = useData()

const currentUrl = computed(() => {
  const baseUrl = 'https://docs.getoptimum.xyz'
  
  let currentPath = '/'
  
  if (typeof window !== 'undefined') {
    currentPath = window.location.pathname
  } else {
    const relativePath = page.value.relativePath || ''
    
    if (relativePath) {
      currentPath = '/' + relativePath.replace(/\.md$/, '').replace(/\/index$/, '')
      if (currentPath === '/') currentPath = '/'
    }
  }
  
  const finalUrl = `${baseUrl}${currentPath}`.replace(/\/+/g, '/').replace(/\/$/, '') || baseUrl
  return finalUrl
})

const claudeUrl = computed(() => {
  const url = currentUrl.value
  const prompt = encodeURIComponent(`Read from ${url} so I can ask questions about it`)
  return `https://claude.ai/new?q=${prompt}`
})

const chatGPTUrl = computed(() => {
  const url = currentUrl.value
  const prompt = encodeURIComponent(`Read from ${url} so I can ask questions about it`)
  return `https://chatgpt.com/?hints=search&q=${prompt}`
})

const llmsTxtUrl = computed(() => {
  return `${site.value.base}llms.txt`.replace(/\/+/g, '/').replace(/^\//, site.value.base === '/' ? '/' : site.value.base)
})

const llmsFullTxtUrl = computed(() => {
  return `${site.value.base}llms-full.txt`.replace(/\/+/g, '/').replace(/^\//, site.value.base === '/' ? '/' : site.value.base)
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function closeDropdown() {
  isOpen.value = false
}

async function copyPageAsMarkdown() {
  try {
    // Get the current page's markdown content from the llms-full.txt file
    const llmsFullUrl = `${window.location.origin}${llmsFullTxtUrl.value}`
    const response = await fetch(llmsFullUrl)
    
    if (response.ok) {
      const fullText = await response.text()
      
      // Extract just this page's content from the full file
      const currentPageUrl = currentUrl.value
      const pageSection = extractPageFromLLMsFile(fullText, currentPageUrl)
      
      if (pageSection) {
        await navigator.clipboard.writeText(pageSection)
      } else {
        // Fallback: create basic markdown from page info
        const pageTitle = page.value.title || 'Documentation Page'
        const markdown = `# ${pageTitle}\n\nSource: ${currentPageUrl}\n\n(Raw markdown content not available)`
        await navigator.clipboard.writeText(markdown)
      }
    } else {
      // Fallback if llms-full.txt is not available
      const pageTitle = page.value.title || 'Documentation Page'
      const markdown = `# ${pageTitle}\n\nSource: ${currentUrl.value}`
      await navigator.clipboard.writeText(markdown)
    }
  } catch (err) {
    console.error('Failed to copy:', err)
    // Final fallback
    const pageTitle = page.value.title || 'Documentation Page'
    const fallbackContent = `# ${pageTitle}\n\nSource: ${currentUrl.value}`
    await navigator.clipboard.writeText(fallbackContent)
  }
  closeDropdown()
}

function extractPageFromLLMsFile(fullText: string, currentPageUrl: string): string | null {
  // Extract the path from the current URL
  const url = new URL(currentPageUrl)
  const targetPath = url.pathname
  
  // Look for the section with this path
  const lines = fullText.split('\n')
  let startIndex = -1
  let endIndex = -1
  
  // Find the start of this page's section
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`**URL:** ${targetPath}`)) {
      startIndex = i + 1 // Start after the URL line
      break
    }
  }
  
  if (startIndex === -1) {
    return null // Page not found
  }
  
  // Find the end of this page's section (next **URL:** or end of file)
  for (let i = startIndex; i < lines.length; i++) {
    if (lines[i].includes('**URL:**') && i > startIndex) {
      endIndex = i - 1
      break
    }
  }
  
  if (endIndex === -1) {
    endIndex = lines.length - 1 // Use end of file
  }
  
  // Extract and clean the content
  const content = lines.slice(startIndex, endIndex + 1).join('\n').trim()
  return content || null
}

function handleClickOutside(event: Event) {
  if (typeof document === 'undefined') return
  
  const target = event.target as Element
  const dropdown = document.querySelector('.llm-dropdown')
  if (dropdown && !dropdown.contains(target)) {
    closeDropdown()
  }
}

onMounted(async () => {
  await nextTick()
  if (typeof document !== 'undefined') {
    document.addEventListener('click', handleClickOutside)
  }
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

<style scoped>
.llm-dropdown {
  position: relative;
  display: inline-block;
  margin-left: 8px;
}

.llm-dropdown-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  background: var(--vp-c-default-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 32px;
}

.llm-dropdown-button:hover {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.llm-dropdown-button.active {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.2s ease;
}

.llm-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  width: 240px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  box-shadow: 0 10px 38px -10px rgba(22, 23, 24, 0.35), 0 10px 20px -15px rgba(22, 23, 24, 0.2);
  z-index: 1000;
  overflow: hidden;
  padding: 6px;
}

.llm-dropdown-header {
  padding: 12px 16px 8px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid var(--vp-c-divider-light);
}

.llm-dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 10px;
  background: transparent;
  border: none;
  color: var(--vp-c-text-1);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  border-radius: 6px;
}

.llm-dropdown-item:hover {
  background: var(--vp-c-default-soft);
}

.llm-dropdown-item:focus {
  outline: none;
  background: var(--vp-c-default-soft);
}

.llm-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.claude-icon {
  background: transparent;
}

.chatgpt-icon {
  background: transparent;
}

/* Theme-aware logo visibility */
.light-logo {
  display: block;
}

.dark-logo {
  display: none;
}

html.dark .light-logo {
  display: none;
}

html.dark .dark-logo {
  display: block;
}

.copy-icon {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}

.markdown-icon {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}

.llms-icon {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.llm-item-arrow {
  margin-left: auto;
  opacity: 0.4;
  transition: opacity 0.2s ease;
  flex-shrink: 0;
}

.llm-dropdown-item:hover .llm-item-arrow {
  opacity: 0.7;
}

.llm-item-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  text-align: left;
}

.llm-item-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  line-height: 1.2;
}

.llm-item-desc {
  font-size: 11px;
  color: var(--vp-c-text-2);
  line-height: 1.3;
}

.llm-dropdown-divider {
  height: 1px;
  background: var(--vp-c-divider-light);
  margin: 6px 4px;
}

.llm-dropdown-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  padding: 0 6px 6px;
  margin-top: 2px;
}

.llm-button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 5px;
  text-decoration: none;
  color: var(--vp-c-text-2);
  background: var(--vp-c-default-soft);
  border: 1px solid var(--vp-c-divider);
  transition: all 0.2s ease;
}

.llm-button:hover {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

/* Dropdown animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}
</style>

