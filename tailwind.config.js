module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      minHeight: {
        fill: '-webkit-fill-available'
      },
    },
  },
  variants: {
    extend: {
      minHeight: ['ios'],
      fontStyle: ['first']
    },
  },
  plugins: [
    ({ addVariant, e, postcss }) => {
      addVariant('ios', ({ container, separator }) => {
        const supportsRule = postcss.atRule({ name: 'supports', params: '(-webkit-touch-callout: none)' })
        supportsRule.append(container.nodes)
        container.append(supportsRule)
        supportsRule.walkRules(rule => {
          rule.selector = `.${e(`ios${separator}${rule.selector.slice(1)}`)}`
        })
      })
    },
  ],
}
