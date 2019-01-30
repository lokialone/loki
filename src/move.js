/*
* 接受 mouse start位置，mouse end 位置，和边界数据。
* 返回物体移动位置
*/
const Move = function () {
    let moveInfo =  {
            x: 0,
            y: 0,
            top: 0,
            left: 0,
            scaleRatio: 1
        };

    /**
     * 记录move开始的数据
     * @param {*} x 
     * @param {*} y 
     * @param {*} top 
     * @param {*} left 
     * @param {*} scaleRatio 
     */
    function start(x, y, top, left, scaleRatio) {
        moveInfo = {
            x,
            y,
            top,
            left,
            scaleRatio
        };
    }

    /**
     * 改变物体的位置坐标
     * @param {*} x 
     * @param {*} y 
     * @param {*} selectItem 
     * @param {*} limit 
     */
    function move (x, y, selectItem, limit) {
        let moveX = x - moveInfo.x;
        let moveY = y - moveInfo.y;
        let left = moveInfo.left + moveX / moveInfo.scaleRatio;
        let top = moveInfo.top + moveY / moveInfo.scaleRatio;
        if (limit) {
            moveLimit(top, left, selectItem, limit);
        } else {
            selectItem.left = left;
            selectItem.top = top;
        }
    }
    
    /**
     * 限制物体无法移动到边界外
     * @param {*} x 
     * @param {*} y 
     * @param {*} item 
     * @param {*} limit 
     */
    function moveLimit(top, left, item, limit) {
        let minLeft = (item.width - limit.width) * -1;
        let maxLeft = 0;
        let minTop = (item.height - limit.height) * -1;
        let maxTop = 0;
        item.left = compare(left, maxLeft, minLeft);
        item.top= compare(top, maxTop, minTop);
    }

    /**
     * 返回在max min之间的值
     * @param {*} v 
     * @param {*} max 
     * @param {*} min 
     */
    function compare(v, max, min) {
        return Math.min(Math.max(v, min), max)
    }

    return {
        start,
        move
    }
}

export default Move();

