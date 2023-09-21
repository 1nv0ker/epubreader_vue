import { h } from 'vue'
import rightArrowImg from '../../assets/右箭头.png'
import bottomArrowImg from '../../assets/下箭头.png'
export default {
    name: 'Directory',
    props: {
        toces: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            activeKey: []
        }
    },
    render(data) {
        const { $data, $emit } = data
        const toces = this.$props.toces
        const activeKey = this.$data.activeKey
        function renderItem(toc) {
            const isActive = activeKey.indexOf(toc.id) !== -1
            return h('div', {
                class: 'toc_item',
                style:'width: 100%;height: auto;padding:4px 0 4px 0;display: flex;align-items: center;cursor: pointer;flex-wrap: wrap;',               
            }, [
                toc.subitems.length>0?(isActive?
                    h('img', {
                        style:'cursor:pointer;width:20px;height:20px;',
                        src: bottomArrowImg,
                        onClickCapture() {
                            const index = $data.activeKey.findIndex(data=>data==toc.id)
                            
                            if (index>-1) {
                                $data.activeKey.splice(index, 1)
                            }
                        },
                    })
                    :h('img', {
                        style:'cursor:pointer;width:20px;height:20px;',
                        src: rightArrowImg,
                        onClickCapture() {
                            const index = $data.activeKey.findIndex(data=>data==toc.id)
                            if (index === -1) {
                                $data.activeKey.push(toc.id)
                            } 
                        },
                    })):'', 
                h('span', {
                    onClickCapture() {
                        $emit('onSelect', toc.href)
                    },
                    innerHTML: toc.label,
                    title: toc.label,
                    style: toc.subitems.length>0?
                    'padding-left:8px;text-overflow: ellipsis;overflow: hidden;max-width: 80%;white-space: nowrap;':
                    'padding-left:24px;text-overflow: ellipsis;overflow: hidden;max-width: 80%;white-space: nowrap;'
                },
                ),
            ],
            (isActive )?h('div', { style:`padding-left:4px;width:100%`, }, toc.subitems.map(item=>renderItem(item))):''
            );
        }


        return h('div', toces.map(toc=>renderItem(toc)))
    }
}