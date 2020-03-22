const {LinValidator,Rule} = require('../../core/lin-validator')

class PositiveIntegerValidator extends LinValidator{
  constructor(){
    super()
    //  使用lin-validator校验规则 三个参数 规则，返回提示信息，附加参数
    //  要与路由的参数信息一一对应 数组形式
    this.id = [ 
      new Rule('isInt','参数必须是正整数',{min:1})
    ]
  }
}

module.exports= {PositiveIntegerValidator}
