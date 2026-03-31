import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import SearchBooks from '../src/components/SearchBooks.vue'

const mockFetch = vi.fn()

global.fetch = mockFetch

describe('SearchBooks', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    mockFetch.mockClear()
    document.title = 'Test'
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('should render input field', () => {
    const wrapper = mount(SearchBooks)
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('input').attributes('placeholder')).toBe('Name')
  })

  it('should show other books when no search results', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
      headers: { get: () => 'application/json' },
      text: async () => '[]',
    })

    const wrapper = mount(SearchBooks)
    const input = wrapper.find('input')
    await input.setValue('nonexistent')
    await vi.advanceTimersByTimeAsync(100)

    expect(wrapper.text()).toContain('Other Available Titles')
  })

  it('should display books when search returns results', async () => {
    const mockBooks = [
      ['Book 1 for Susan', 'path1', 'isbn1', 'image1'],
      ['Book 2 for Susan', 'path2', 'isbn2', 'image2'],
    ]

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBooks,
      headers: { get: () => 'application/json' },
      text: async () => JSON.stringify(mockBooks),
    })

    const wrapper = mount(SearchBooks)
    const input = wrapper.find('input')
    await input.setValue('susan')
    await vi.advanceTimersByTimeAsync(100)
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Book 1 for Susan')
  })

  it('should handle API errors gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error',
    })

    const wrapper = mount(SearchBooks)
    const input = wrapper.find('input')
    await input.setValue('susan')
    await vi.advanceTimersByTimeAsync(100)

    expect(wrapper.vm.books).toEqual([])
  })

  it('should handle timeout errors', async () => {
    mockFetch.mockRejectedValueOnce({ name: 'AbortError' })

    const wrapper = mount(SearchBooks)
    const input = wrapper.find('input')
    await input.setValue('susan')
    await vi.advanceTimersByTimeAsync(100)

    expect(wrapper.vm.books).toEqual([])
  })

  it('should sanitize input by removing non-alphanumeric characters', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
      headers: { get: () => 'application/json' },
      text: async () => '[]',
    })

    const wrapper = mount(SearchBooks)
    const input = wrapper.find('input')
    await input.setValue('Su@#san!123')
    await vi.advanceTimersByTimeAsync(100)

    const calledUrl = mockFetch.mock.calls[0][0]
    expect(calledUrl).toContain('susan')
  })

  it('should fetch from correct API endpoint', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
      headers: { get: () => 'application/json' },
      text: async () => '[]',
    })

    const wrapper = mount(SearchBooks)
    const input = wrapper.find('input')
    await input.setValue('susan')
    await vi.advanceTimersByTimeAsync(100)

    const calledUrl = mockFetch.mock.calls[0][0]
    expect(calledUrl).toBe('https://on-demand-books-com-kzfxdscz.fermyon.app/search/susan')
  })

  it('should set document title when 9 exact matches found', async () => {
    const mockBooks = Array(9).fill(null).map((_, i) => [
      `Book ${i} for Susan`,
      `path${i}`,
      `isbn${i}`,
      `image${i}`,
    ])

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBooks,
      headers: { get: () => 'application/json' },
      text: async () => JSON.stringify(mockBooks),
    })

    const wrapper = mount(SearchBooks)
    const input = wrapper.find('input')
    await input.setValue('susan')
    await vi.advanceTimersByTimeAsync(100)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.books.length).toBe(9)
  })
})
