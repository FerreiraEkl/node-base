module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['module-resolver', {
      alias: {
        '@interfaces': './src/schemas/interfaces',
        '@schemas': './src/schemas/models',
        '@controllers': './src/controllers',
        '@configs': './src/config'
      }
    }]
  ],
  ignore: [
    '**/*.spec.ts'
  ]
}
