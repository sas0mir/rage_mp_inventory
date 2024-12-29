import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Inventory from '../Inventory.vue'

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(Inventory)
    expect(wrapper.text()).toContain('Stash')
  })
})
