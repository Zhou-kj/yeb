<template>
  <div id="uesrtext">
    <textarea placeholder="按 Ctrl + Enter 发送" v-model="content" v-on:keyup="addMessage"></textarea>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'uesrtext',
  data () {
    return {
      user: window.sessionStorage.getItem('user'),
      content:''
    }
  },
  computed: mapState([
  'currentSession'
	]),
  methods: {
  	addMessage (e) {
  		if (e.ctrlKey && e.keyCode ===13 && this.content.length) {
        let msg = new Object()
        msg.to = this.currentSession.username
        msg.content = this.content
        this.$store.state.ws.send(JSON.stringify(msg))
        console.log(msg)
        this.$store.commit('addMessage', msg)
        this.content=''
        
  		}
  	}
  }
}
</script>

<style scoped>
#uesrtext {
	position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 30%;
  border-top: solid 1px #DDD;
}
#uesrtext > textarea {
  	padding: 10px;
  	width: 100%;
  	height: 100%;
  	border: none;
  	outline: none;
  }
</style>
