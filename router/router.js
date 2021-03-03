class Router {
  constructor(params) {
    this.cache = params.router;
    this.init();
  }

  //初始化 添加监听浏览器hashchange 以及dom loaded函数
  init() {
    window.addEventListener('hashchange', () => {
      this.trigger();
    });
    window.addEventListener('load', () => {
      this.trigger();
    })
  };

  //匹配hash对应的回调函数,并触发
  trigger() {
    const hash = location.hash.slice(1) || 'default';
    const cache = this.cache;
    for (const r in cache) {
      if (cache.hasOwnProperty(r)) {
        const reg = this.initRegexps(r);
        if (reg.test(hash)) {
          document.getElementById('app').innerHTML = cache[r]
        }
      }
    }

  };

  /**
   *将cache内的key 做正则处理,并返回
   * 第一个正则 匹配诸如/,.+-?$#{}[]] 关键字  并在关键字前面加转译字符\
   * 第二个正则 匹配() 标示()内部内容可有可无
   * 第三个正则 匹配: 在/后面可以由接受任意字符,直到遇到下一个/
   * 第四个正则 匹配* 在*后面可以由接受任意字符
   */
  initRegexps(route) {
    route = route.replace(/[/,.+\-?$#{}\[\]]/g, '\\$&')
        .replace(/\((.*?)\)/g, '(?:$1)?')
        .replace(/(\/\w?:\w+)+/g, '\/([^/]+)')
        .replace(/\*\w*/g, '([^?]*?)');

    return new RegExp('^' + route + '$');
  };

  //将匹配的正则返回,为回调函数提供参数
  getParams(reg, hash) {
    return reg.exec(hash).slice(1);
  }
}

