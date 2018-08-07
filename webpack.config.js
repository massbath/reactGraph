module.exports = {
  /*Différents modules à exporter*/
  entry: {
    appWatGenerator: './App/main.js'
  },

  /*Build correspondant aux modules*/
  output: {
    path: __dirname + '/dist',
    filename: '[name]Build.js'
  },

  devServer: {
    inline: true,
    port: 8080
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',

        options: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  }
}
