import { connect } from 'react-redux'
import wxInit from 'src/app/lib/wx_config'
import TipsActions from 'src/app/actions/tips_actions.js'
import QiniuAction from 'src/app/actions/independent/upload_images_action.js'
import deviceType from 'src/app/lib/device_type'
import { useState, useLayoutEffect, useRef } from 'react'
import loadJs from 'src/app/lib/load_js.js'
import './index.scss'

UploadImaqes.defaultProps = {
  postImgs: [], //图片列表
  postImgsMax: 3, //上传的最大张数
  updateSuccess: () => {} //加载成功回调，成功后将图片url数组当参数传回,
}

function UploadImaqes(props) {
  if (!window.qiniu) {
    loadJs('https://unpkg.com/qiniu-js@2.5.4/dist/qiniu.min.js')
  }

  const { dispatch, postImgsMax } = props
  const [postImgs, setPostImgs] = useState(props.postImgs)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadToken, setToken] = useState(null)
  const [localUrls, setLocalUrls] = useState(props.postImgs)
  const [loadingArr, setLoadingArr] = useState(
    new Array(props.postImgs.length).fill(false)
  )

  const inputRef = useRef(null)
  let uploadNum = 0

  useLayoutEffect(() => {
    if (!uploadToken) {
      dispatch(QiniuAction((patch, { data }) => setToken(data.upload_token)))
    }
    wxInit()
  }, [])

  const handleUpdate = e => {
    const files = e.target.files
    const filesNum = files.length
    if (filesNum + postImgs.length > props.postImgsMax) {
      dispatch(
        TipsActions.changeTips({
          isShow: true,
          content: `最多只能上传${props.postImgsMax}张图片`
        })
      )
      return null
    }
    setIsLoading(true)
    uploadNum = filesNum
    const [urls, loadArr] = [new Array(filesNum), new Array(filesNum)]
    let oldArr = [...localUrls]
    _.map(files, (file, key) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        urls[key] = reader.result
        setLocalUrls([...oldArr, ...urls])
        loadArr[key] = true
        setLoadingArr([...loadingArr, ...loadArr])
      }
      const index = oldArr.length + key
      uploadQiniuImages(file, uploadToken, uploadQiniuSuccces, index)
    })
  }

  const uploadQiniuSuccces = (url, index) => {
    let urls = []
    setPostImgs(imgs => {
      const newImgs = [...imgs]
      newImgs[index] = url
      urls = newImgs
      return newImgs
    })
    setLoadingArr(LoadingArr => LoadingArr.fill(false))
    // NOTE:当前完成全部upload后，需要设置loading为false以及设置input的value
    uploadNum -= 1
    if (uploadNum === 0) {
      inputRef.current && (inputRef.current.value = '')
      setIsLoading(false)
      props.updateSuccess(urls)
    }
  }

  const deleteImage = index => {
    setPostImgs(postImgs => {
      const imgs = [...postImgs]
      imgs.splice(index, 1)
      return imgs
    })
    setLocalUrls(localUrls => {
      const urls = [...localUrls]
      urls.splice(index, 1)
      return urls
    })

    !props.isUploadInSelect && props.deleteImage && props.deleteImage(index)
  }

  const previewImage = index => () => {
    if (!isLoading) {
      wx.ready(() => {
        wx.previewImage({
          current: postImgs[index], // 当前显示图片的http链接
          urls: postImgs, // 需要预览的图片http链接列表
          fail: () => wxInit(true, () => previewImage(index))
        })
      })
    }
  }

  const uploadQiniuImages = (file, uploadData, uploadSuccess, index) => {
    if (!file || !uploadData) {
      return null
    }
    let fileName = file.name
    // NOTE：手机拍照需要处理一下fileName，避免重复name
    if (fileName.indexOf('image') >= 0) {
      fileName = `${new Date().getTime()}_${fileName}`
    }
    const putExtra = { fname: fileName, params: {}, mimeType: null }
    const observer = {
      complete: res => {
        uploadSuccess(`${uploadData.bucket_url}/${res.key}`, index)
      }
    }
    const observable = window.qiniu.upload(
      file,
      fileName,
      uploadData.upload_token,
      putExtra,
      { useCdnDomain: true }
    )
    observable.subscribe(observer)
    // const subscription = observable.subscribe(observer)
    // console.log(subscription)
    // subscription.unsubscribe()，可以取消当前的上传，目前不需要用到
  }

  const isIos = deviceType().isiOS
  const imgs = localUrls
  return (
    <div className="upload-images-conatainer">
      {_.map(imgs, (url, index) => {
        return (
          <div
            key={index}
            onClick={previewImage(index)}
            className="file-img preview-img"
            style={{
              backgroundImage: `url(${url})`
            }}
          >
            <span
              onClick={e => {
                e.stopPropagation()
                if (isLoading) return null
                deleteImage(index)
              }}
              className="delete-icon"
            />
            {loadingArr[index] && (
              <div className="loading-box">
                <img
                  alt=""
                  src={require('src/app/containers/ratings/images/Dual_Ring_loading.svg')}
                  className="icon"
                />
              </div>
            )}
          </div>
        )
      })}
      {imgs.length < postImgsMax && (
        <div className="file-img post-img-box">
          <input
            type="file"
            name="image"
            accept={isIos ? 'image/jpeg,image/jpg,image/png' : 'image/*'}
            className="post-img"
            onChange={handleUpdate}
            ref={inputRef}
            multiple={isIos}
            alt=""
          />
          {isLoading && <div className="cover-input" />}
          <div className="post-tips-box">
            <img alt="" src={require('./images/tips-img.svg')} className="" />
            <span className="post-text">{`${imgs.length +
              1}/${postImgsMax}`}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default connect()(UploadImaqes)
