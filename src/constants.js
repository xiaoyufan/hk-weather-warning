module.exports = {
  botSettings: {
    token: '199486071:AAGhKx1xbejLcBI9aNwEiITxihwtgBiw17c'
  },

  rssSettings: {
    poll_interval: 10 // minutes
  },

  rssTopics: {
    current: {
      en: 'http://rss.weather.gov.hk/rss/CurrentWeather.xml',
      tc: 'http://rss.weather.gov.hk/rss/CurrentWeather_uc.xml',
      sc: 'http://gbrss.weather.gov.hk/rss/CurrentWeather_uc.xml'
    },
    warning: {
      en: 'http://rss.weather.gov.hk/rss/WeatherWarningSummaryv2.xml',
      tc: 'http://rss.weather.gov.hk/rss/WeatherWarningSummaryv2_uc.xml',
      sc: 'http://gbrss.weather.gov.hk/rss/WeatherWarningSummaryv2_uc.xml'
    }
  },

  rssLanguages: {
    default: 'en',
    others: ['tc', 'sc']
  }
};
