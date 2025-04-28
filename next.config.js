// next.config.js

module.exports = {
    images: {
      domains: ['i.ytimg.com'],
    },
    allowedDevOrigins: ['http://basic-trackbacks.gl.at.ply.gg'],
    webpack: (config, { isServer }) => {
      if (isServer) {
        config.externals.push({
          'ffmpeg-static': 'commonjs ffmpeg-static'
        })
      }
      return config
    },
  }
  