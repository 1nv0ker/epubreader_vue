<template>
    <div  class=" w-1000px h-800px relative">
        <div class="w-full flex" style="height: calc( 100% - 63px );">
            <div class="w-300px overflow-auto p-8px h-full" v-show="isExpand" style="background:#f7f7f7">
            <Directory :toces="toces" @onSelect="onSelect" />
            </div>
            <div id="reader" :style="isExpand?'width:calc( 100% - 300px );height:100%':'width:100%;height:100%'">
            </div>
        </div>
    </div>
</template>
<script>
let book;
let rendition;
import Directory from './directory'
import axios from 'axios'
export default {
    components: {
        Directory: Directory
    },
    props: {
        filePath: {
            type:String,
            default: 'http://localhost:8080/test.epub'
        },
        isExpand: Boolean
    },
    data() {
        return {
            toces: [],
            tocIds: [],
            searchList: []
        }
    },
    methods: {
        search(q) {
            var doSearch = (q) => {
                return Promise.all(book.spine.spineItems.map(item => 
                    item
                        .load(book.load.bind(book))
                        .then(item.find.bind(item, q))
                        .finally(item.unload.bind(item))
                )).then(results => Promise.resolve([].concat.apply([], results)))
            }
            doSearch(q).then((result) => {
                let searchList = result
                this.searchList.forEach(list=>this.removeHighLight(list))
                searchList.forEach(list=>this.setHighLight(list))
                searchList[0] && rendition.display(searchList[0]['cfi'])
                this.searchList = searchList
            });
        },
        setHighLight(list) {
            const cfiRange = list.cfi;
            rendition.annotations.highlight(cfiRange);
        },
        removeHighLight(list) {
            const cfiRange = list.cfi;
            rendition.annotations.remove(cfiRange, 'highlight');
        },
        async initBook() {
            this.tocIds = []
            this.toces = []
            rendition && rendition.clear()
            book && book.destroy()
            const res = await axios.get(this.filePath,  {
                responseType: 'blob'
            })
            const file = res.data
            book = ePub(file, 'blob');
            rendition = book.renderTo("reader", { 
                manager: "continuous",
                flow: "scrolled",
                width: '100%', height: '100%'}
            );
            rendition.themes.default({
                p: {
                    "letter-spacing": '4px'
                },
                body: {
                    'background': '#f5f3f3'
                }
            });
            rendition.display()
            .catch((err) => {
                throw new Error('书籍加载失败: '+err)
            })
            book.loaded.navigation.then((toc) => {
                this.toces = toc.toc
                this.tocIds = Object.keys(toc.tocByHref)
            })
            this.onKeyBoard()
        },
        keyListener(e) {
            // Left Key
            if ((e.keyCode || e.which) == 37) {
                this.onPrev()
            }
            // Right Key
            if ((e.keyCode || e.which) == 39) {
                this.onNext()
            }
        },
        onKeyBoard() {
            rendition.on("keyup", this.keyListener);
            document.addEventListener("keyup", this.keyListener, false);
        },
        onNext() {
            rendition.next()
        },
        onPrev() {
            rendition.prev()
        },
        onSelect(href) {
            return rendition.display(href)
        },
        getBookLen() {
            return book.spine.spineItems
        },
        onChangeSize(key) {
            rendition && rendition.themes.fontSize(key)
        },
        onExpand() {
            this.contentResize()
        },
        contentResize() {
            this.$nextTick(() => {
                rendition && rendition.resize()
            })
        },
        reset() {
            rendition && endition.off("keyup", this.keyListener);
            document.removeEventListener('keyup', this.keyListener, false);
            rendition && rendition.clear()
            book && book.destroy()
            book = null;
            rendition = null;
        }
    },
    destroyed() {
        this.reset()
    },
}
</script>
<style lang="less">
    .dasd {
        text-align: left;
    }
    .content-search-text {
        color: rgb(144, 238, 144);
    }
</style>