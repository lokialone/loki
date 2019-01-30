import { partial } from 'ramda'
const Scale = function () {
    let scaleInfo = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        scaleRatio: 1,
        dir: ''
    }

    function initItemProp(item) {
        const props = ['left', 'top', 'width', 'height', 'rotate']
        props.forEach((key) => {
            scaleInfo[key] = item[key]
        })
    }

    function start(x, y, item) {
        scaleInfo.x = x;
        scaleInfo.y = y;
        initItemProp(item);
        scaleInfo.scaleRatio = 1;
        scaleInfo.startCoor = {
            x: 0,
            y: 0
        }
        let {x: centerX, y: centerY} = getCenterCoor(item.left, item.top, item.width, item.height);
        scaleInfo.centerX = centerX;
        scaleInfo.centerY = centerY;
        scaleInfo.dir = getDirction();
        console.log('dir', scaleInfo.dir);
         /* eslint-disable */

        // scaleInfo.limit = limit;
        scaleInfo.ratio = item.ratio;
        // if (item.clip) {
        //     scaleInfo.clip = {
        //         width: item.clip.width,
        //         height: item.clip.height,
        //         top: item.clip.top,
        //         left: item.clip.left
        //     }
        // } else {
        //     scaleInfo.clip = {};
        // }
    }

    function getAbsoluteCoor(x, y) {
        return {
            x: x + scaleInfo.startCoor.x,
            y: y + scaleInfo.startCoor.y
        }
    }

    function getRelativeCoor(x, y) {
        return {
            x: x - scaleInfo.startCoor.x,
            y: y - scaleInfo.startCoor.y
        }
    }

    function getCenterCoor(x, y, w, h) {
        return {
            x: scaleInfo.startCoor.x + x * scaleInfo.scaleRatio + w / 2 * scaleInfo.scaleRatio,
            y: scaleInfo.startCoor.y + y * scaleInfo.scaleRatio + h / 2 * scaleInfo.scaleRatio
        }
    }

    function getRotateCoor(x0, y0, x1, y1) {
        // 获取弧度值
        let radia = scaleInfo.rotate * Math.PI / 180;
        let x = (x1 - x0) * Math.cos(radia) - (y1 - y0) * Math.sin(radia) + x0;
        let y = (x1 - x0) * Math.sin(radia) + (y1 -y0) * Math.cos(radia) + y0;

        return {
            x,
            y
        }
    }

    //限制height
    // function repairHeight (height, minHeight) {
    //     // height = Math.min(this.Max ? mxHeight : height, height);
    //     // height = Math.max(this.Min ? this.minHeight : height, height, 0);
    //     height = Math.max(minHeight, height);
    //     return height;
    // }
    //限制width
    function repairWidth (width) {
        let limit = scaleInfo.limit;
        let minWidth = 0;
        if (limit) {
            minWidth = limit.width > limit.height ? limit.width : limit.height;
        }
        return Math.max(width, minWidth);
    }
    //根据比例修正高度
    function repairScaleHeight(width) {
        return width / scaleInfo.ratio;
    }
    //根据比例修正宽度
    // function repairScaleWidth(height) {
    //     return height * scaleInfo.ratio;
    // }


    function getRepairAngle(width, height, isRatio = false) {
        if (!isRatio) return {
            rWidth: width,
            rHeight: height
        }
        // width = repairWidth(width, mxWidth);
        // if(this.Scale){
        //     height = repairScaleHeight(width);
        //     if(this.Max && height > mxHeight){
        //         height = mxHeight;
        //         width = repairScaleWidth(height);
        //     }else if(this.Min && height < this.minHeight){
        //         var tWidth = repairScaleWidth(this.minHeight);
        //         if(tWidth < mxWidth){ height = this.minHeight; width = tWidth; }
        //     }
        // }else{
        //     height = repairHeight(height, mxHeight);
        // }
        let rWidth = repairWidth(width);
        let rHeight = repairScaleHeight(rWidth);
        // if (height < minHeight) {
        //     var tWidth = repairScaleWidth(minHeight);
        //     rHeight = minHeight;
        //     rWidth = tWidth
        // }
        return {
            rHeight,
            rWidth
        }
    }
    function getDirction() {
         // 当前中心坐标位置
         let x0 = scaleInfo.centerX;
         let y0 = scaleInfo.centerY;
         // 点击缩放的位置
         let x1 = scaleInfo.x;
         let y1 = scaleInfo.y;
         console.log(x0,y0, x1,y1)
         if (x1 > x0) {
             if (y1 > y0) return 'rb';
             return 'rt';
         } else {
             if (y1 > y0) return 'lb';
             return 'lt';
         }
    }

    function rt1(x, y, isRatio) {
        let dx = x - scaleInfo.x;
        let dy = y - scaleInfo.y;
        let radia = scaleInfo.rotate * Math.PI / 180;
        const bolt = radia + Math.atan(-dy/dx);
        const l = Math.sqrt(dx * dx + dy * dy);

        let dxBolt = Math.cos(bolt) * l;
        let dyBolt = Math.sin(bolt) * l;
        let width = scaleInfo.width + dxBolt;
        let height = scaleInfo.height + dyBolt;
        const {rWidth, rHeight} = getRepairAngle(width, height, isRatio);
        // 获取弧度值

        // 获取未旋转的放大后的中心坐标
        let {x: x0, y: y0 } = getCenterCoor(scaleInfo.left, scaleInfo.top, width, height);
        // 获取旋转并发大后的中心坐标
        let {x: x1, y: y1 } = getRotateCoor(scaleInfo.centerX, scaleInfo.centerY, x0, y0);
        // 移动到应该位置的中心坐标
        let x2 = x1 + dyBolt * Math.sin(radia);
        let y2 = y1 - dyBolt * Math.cos(radia);
        let top = scaleInfo.top + (y2 - y0);
        let left = scaleInfo.left + (x2 - x0);
        return {
            width: width,
            height: height,
            top,
            left
        }
    }
    //right - top 方向上缩放
    function rt(x, y, isRatio) {
        const getCenteRotateCoor = partial(getRotateCoor, [scaleInfo.centerX, scaleInfo.centerY])
        let radia = scaleInfo.rotate * Math.PI / 180;
        // 计算width,height
        let {x: x1, y: y1} = getAbsoluteCoor(scaleInfo.left, scaleInfo.top);
        let {x: xr1, y: yr1} = getCenteRotateCoor(scaleInfo.centerY, x1, y1);
        let x3 = x1;
        let y3 = y1 + scaleInfo.height;
        let {x: xr3, y: yr3} = getCenteRotateCoor(x3, y3);

        let height = ((y - yr3) * -1) * Math.cos(radia);
        let width = x - x3;
       
        // 以下计算偏移量
        // 获取未旋转的放大后的中心坐标
        let {x: xc0, y: yc0 } = getCenterCoor(scaleInfo.left, scaleInfo.top, width, height);
        // 获取旋转并发大后的中心坐标
        let {x: xc1, y: yc1 } = getCenteRotateCoor(xc0, yc0);
        // 移动到应该位置的中心坐标
        let xc2 = xc1 + (width - scaleInfo.width) * Math.sin(radia);
        let yc2 = yc1 - (height - scaleInfo.height) * Math.cos(radia);
        let top = scaleInfo.top + (yc2 - yc0);
        let left = scaleInfo.left + (xc2 - xc0);

        return {
            width: width,
            height: height,
            top,
            left
        }
    }

    // right - bottom 方向上传缩放
    function rb(dx, dy, isRatio) {
        let width = scaleInfo.width + dx / scaleInfo.scaleRatio;
        let height = scaleInfo.height + dy / scaleInfo.scaleRatio;
        const {rWidth, rHeight} = getRepairAngle(width, height, isRatio);
        return {
            width: rWidth,
            height: rHeight
        }

    }
    // left - top 方向上缩放
    function lt(dx, dy, isRatio) {
        let width = scaleInfo.width - dx / scaleInfo.scaleRatio;
        let height = scaleInfo.height - dy / scaleInfo.scaleRatio;
        const {rWidth, rHeight} = getRepairAngle(width, height, isRatio);
        let left = scaleInfo.left - (rWidth - scaleInfo.width);
        let top = scaleInfo.top - (rHeight - scaleInfo.height);

        return {
            width: rWidth,
            height: rHeight,
            top,
            left
        }
    }

    // left -bottom
    function lb(dx, dy, isRatio) {
        let width = scaleInfo.width - dx / scaleInfo.scaleRatio;
        let height = scaleInfo.height + dy / scaleInfo.scaleRatio;
        const {rWidth, rHeight} = getRepairAngle(width, height, isRatio);
        let left = scaleInfo.left - (rWidth - scaleInfo.width);

        return {
            width: rWidth,
            height: rHeight,
            left
        }
    }

    function getScaleRes(x, y, isRatio = false) {
        let dx = x - scaleInfo.x;
        let dy = y - scaleInfo.y;
        let dir = scaleInfo.dir;
        let res = {};
        if (dir === 'rt') {
            res = rt(x, y, isRatio);
        } else if (dir == 'rb') {
            res = rb(dx, dy, isRatio);
        } else if (dir === 'lt') {
           res = lt(dx, dy, isRatio);
        } else if (dir === 'lb'){
           res = lb(dx, dy, isRatio)
        }
        return res;
    }

    function setItem(item, res) {
        item.width = res.width;
        item.height = res.height;
        if(res.top) item.top = res.top;
        if(res.left) item.left = res.left;
    }

    //外部scale, 缩放时需要看情况修改clip的width和height
    function scaleWithLimit(x, y, item) {
        let res = getScaleRes(x, y, false);
        setItem(item, res);
        // if (item.width > scaleInfo.clip.width - item.clip.left && item.height > scaleInfo.clip.height - item.clip.height) {
        //     let w0 = item.width - item.clip.left;
        //     let h0 = item.height - item.clip.height;
        //     let w1 = w0;
        //     let h1 = w1 / scaleInfo.ratio;

        //     let h2 = h0;
        //     let w2 = h2 * scaleInfo.ratio;

        //     if (w1 >= w0 && h1 >= h0) {
        //         item.clip.width = w1;
        //         item.clip.height = h1;
        //     } else {
        //         item.clip.width = w2;
        //         item.clip.height = h2;
        //     }
        // }
    }
    // clip scale方法
    function rateScale(x, y, item) {
        let res = getScaleRes(x, y, true);
        setItem(item, res);
    }

    return {
        start,
        scaleWithLimit,
        rateScale,
        rt
    }
}


export default Scale();
