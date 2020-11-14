import { message } from 'ant-design-vue';

export default ({ $axios, $cookies }) => {

  $axios.onRequest(config => {
    const token = $cookies.get('teacherAccessToken')
    if (token) {
      config.headers.authorization = `Bearer ${token}`
    }
    return config
  })


  $axios.onError(error => {
    const { data, status } = error.response
    if (status == 401) location.href = '/auth/login'
    message.info(data.message);
  })
}