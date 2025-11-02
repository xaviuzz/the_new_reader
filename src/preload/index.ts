import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { Feed, Article } from '../main/domain'

// Custom APIs for renderer
const api = {
  addFeed: (url: string): Promise<Feed> => ipcRenderer.invoke('feeds:add', url),
  listFeeds: (): Promise<Feed[]> => ipcRenderer.invoke('feeds:list'),
  getArticles: (feedUrl: string): Promise<Article[]> => ipcRenderer.invoke('feeds:getArticles', feedUrl)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
