<template>
    <div class='container' @mousemove="mousemove">
        <div class="item-wrap"
            :style="{
                transform: `translate(${item.left}px,${item.top}px) rotate(${item.rotate}deg)`
            }">
            <div class="item"
            :style="{
                width: `${item.width}px`,
                height: `${item.height}px`
                }">
                <div class="clip"
                    :style="{
                        width: `${clip.width}px`,
                        height: `${clip.height}px`
                    }">
                    <div class="image-deal">
                        <img 
                        class="img-defualt" 
                        src="//img2.3lian.com/2014/f5/63/d/16.jpg" 
                        draggable="false"
                        :style="{
                            opacity: item.opacity,
                            width: `${clip.width}px`,
                            height: `${clip.height}px`,
                            transform: `translateX(0px)`
                        }"
                        />
                    </div>
            </div>
            <div class="rotate-icon-wrap">
                <img class="rotate-icon"
                    @mousedown="rotate"
                    src="//img.souche.com/f2e/ef093205078121301aac92cf42401389.png" alt=""  draggable="false">
            </div>
            <div class="scale-icon lt" data-type="scale-lt"></div>
                <div class="scale-icon rt" 
                    @mousedown="scale"
                    draggable="false">
                </div>
                <div class="scale-icon lb" data-type="scale-lt"> </div>
                <div class="scale-icon rb" data-type="scale-lt"> </div>
        </div>  
        </div>   
    </div>
</template>
<script>
import TRotate from './rotate.js'
import TScale from './scale'
export default {
    name: 'app',
    data(){
        return {
            item: {
                left: 100,
                top: 100,
                rotate: 0,
                width: 100,
                height: 100,
                opcaity:1,  
            },
            startX: 0,
            startY: 0,
            isScale: false,
            isRotate: false,
            isClip: true,
            clip: {
                width: 200,
                height: 200
            }
            

        };
    },
    computed: {},
    created() {},
    mounted() {
        document.addEventListener('mouseup', (e) => {
            // this.mouseup(e);
            this.isScale = false;
            this.isRotate = false;
        });

    },
    methods: {
        getSelectType(e) {
            return e.target.dataset.type || '';
        },
        getSelectInfo(e) {
            return e.target.dataset.info;
        },
        rotate(e) {
            this.isRotate = true;
            TRotate.start(e.x, e.y, this.item, {x: 0, y: 0}, 1);
        },
        scale(e) {
            this.isScale = true;
            TScale.start(e.x, e.y, this.item);
        },
        mousemove(e) {
            if (this.isRotate) TRotate.move(e.x, e.y, this.item);
            if (this.isScale) TScale.scaleWithLimit(e.x, e.y, this.item);
        }
    },
    components: {}
};
</script>
<style scoped lang='less'>
html, body{
    margin: 0
}
.container{
    width: 400px;
    height: 400px;
    border: 1px solid red;
    display: inline-block;
    .item-wrap{
        position: relative;
        display: inline-block;
    }
    .item {
        overflow: hidden;
    }
    .clip {
        overflow: hidden;
        background-color: rgba(0, 0, 0, 0.5);
    }
    // background: black;
    .img-defualt {
        width: 100%;
        height: 100%;
        // position: absolute;
        cursor: all-scroll;
    }
    .scale-icon{
        position: absolute;
        background: red;
        height: 10px;
        width: 10px;
        border-radius: 50%;
        cursor: ne-resize;
        z-index: 2;
        &.lt {
            top: -5px;
            left: -5px;
        }
        &.rt{
            top: -5px;
            right: -5px;
        }
        &.lb{
            bottom: -5px;
            left: -5px;
        }
        &.rb{
            bottom: -5px;
            right: -5px;
        }
    }
    .rotate-icon-wrap{
        cursor: ew-resize;
        text-align: center;
        position: absolute;
        bottom: -40px;
        left: 50%;
        // width: 60px;
        margin:0 0 0 -18px;
        .rotate-icon {
            width: 36px;
            height: 36px;
        }
    }
}
</style>

