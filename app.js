import bar from './bar'
import './index.css'
import Vue from 'vue'
import lodash from 'lodash'
import $ from 'jquery'
// console.log(process.env)
console.log($)
console.log('sasasa')
bar()
console.log(2333334443)
console.log(Vue)

let app1 = () => {
  import(/* webpackChunkName: "app1" */ './app1').then(res => {
    console.log(res.default())
  })
}

let app2 = () => {
  import(/* webpackChunkName: "app2" */ './app2').then(res => {
    console.log(res.default())
  })
}

app1()
app2()