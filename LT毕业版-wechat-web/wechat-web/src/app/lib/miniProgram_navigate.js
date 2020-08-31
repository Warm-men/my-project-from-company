export const miniProgramNavigate = url => {
  if (_.includes(url, 'weixin')) {
    window.location.href = url
  } else {
    wx.miniProgram.navigateTo({
      url: `/pages/web-view/web-view?redirect_uri=${encodeURIComponent(url)}`
    })
  }
}
