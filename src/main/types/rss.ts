import type Parser from 'rss-parser'

export type RssFeed = Parser.Output<{ [key: string]: unknown }>
export type RssItem = Parser.Item & { description?: string }
export type RssEnclosure = Parser.Enclosure
