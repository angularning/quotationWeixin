Component({
  // 私有数据
  data: {
    onLq: false,
    lqComplate: false,
  },
  // 方法
  methods: {
    close(){
      this.triggerEvent('close', false) //myevent自定义名称事件，父组件中使用
    },
    lingqu(){
      this.setData({
        onLq: true
      })
      setTimeout(()=>{
        this.setData({
          onLq: false
        })
      },2000)
      this.triggerEvent('lingqu', this.data.hbData) //myevent自定义名称事件，父组件中使用
      this.setData({
        lqComplate: true,
      })
    },
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  lifetimes: {
    attached: function() {
      // console.log('attached');
    },
    moved: function() {},
    detached: function() {},
  },

  // 组件所在页面的生命周期函数
  pageLifetimes: {
    show: function() {
      console.log('生命show!');
    },
  },

  // 变量替换以及修改
  properties: {
    hbData: {
      type: String
    }
    }
})