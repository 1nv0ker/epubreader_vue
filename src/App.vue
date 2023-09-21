<template>
    <div class="w-full h-full p-24px">
      <div class="w-full h-auto p-8px flex gap-5 items-center">
        <div class="pl-8px pr-8px flex items-center justify-center h-32px w-80px cursor-pointer" 
          style="background:#d7d7d7;font-size: 14px;border-radius: 8px;" @click="onExpand">
          {{isExpand?'收起':'展开'}}
        </div>
        <div class="pl-8px pr-8px flex items-center justify-center h-32px w-80px cursor-pointer" 
          style="background:#d7d7d7;font-size: 14px;border-radius: 8px;" 
          @click="onAmplify">
          放大
        </div>
        <div class="pl-8px pr-8px flex items-center justify-center h-32px w-80px cursor-pointer" 
          style="background:#d7d7d7;font-size: 14px;border-radius: 8px;" @click="onReduce">
          缩小
        </div>
        <div class="pl-8px pr-8px flex items-center justify-center h-32px w-80px cursor-pointer" 
          style="background:#d7d7d7;font-size: 14px;border-radius: 8px;" @click="onNext"> 
          向前
        </div>
        <div class="pl-8px pr-8px flex items-center justify-center h-32px w-80px cursor-pointer" 
          style="background:#d7d7d7;font-size: 14px;border-radius: 8px;" @click="onPrev">
          向后
        </div>
        <div>
        <span>输入内容搜索:</span>
          <input type="text" id="name" class="border" name="name" required minlength="4" maxlength="8" size="10" 
          @keyup.enter.native="searchEnter" v-model="searchValue"/>
        </div>
      </div>
      <epbuVue ref="epubref" :isExpand="isExpand"/>
    </div>
</template>
<script>
import epbuVue from './components/epub/index.vue'
export default {
  name: 'App',
  components: {
    epbuVue
  },
  data() {
    return {
      isExpand: true,
      fontSize: 100,
      searchValue: ''
    }
  },
  mounted() {
    this.$refs.epubref.initBook();
  },
  methods: {
    onExpand() {
      this.isExpand=!this.isExpand;
      this.$refs.epubref.onExpand()
    },
    onAmplify() {
      this.fontSize=this.fontSize+10;
      this.$refs.epubref.onChangeSize(this.fontSize+'%')
    },
    onReduce() {
      if(this.fontSize==10) return;
      this.fontSize=this.fontSize-10;
      this.$refs.epubref.onChangeSize(this.fontSize+'%')
    },
    onNext() {
      this.$refs.epubref.onNext();
    },
    onPrev() {
      this.$refs.epubref.onPrev();
    },
    searchEnter() {
      if(!this.searchValue) return
      this.$refs.epubref.search(this.searchValue)
    }
  }
}
</script>

<style lang="less">
#app,html,body {
  width: 100%;
  height: 100%;
}
</style>
