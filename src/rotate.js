const Rotate = function () {
    let rotateInfo = {
        centerX: 0,
        centerY: 0,
        x: 0,
        y: 0,
        rotate: 0
    }

    function start(x, y, item, startCoor, scaleRatio) {
        rotateInfo.centerX = startCoor.x + item.left * scaleRatio + item.width / 2 * scaleRatio;
        rotateInfo.centerY = startCoor.y + item.top * scaleRatio + item.width / 2 * scaleRatio;
        rotateInfo.x = x;
        rotateInfo.y = y;
        rotateInfo.rotate = item.rotate;
    }

    function getMag(x, y) {
        return Math.sqrt(x * x + y * y);
    }

    /** 
     * 通过面积量的方法来判断顺时针还是逆时针
     * 平面上三个点: 
     * p1(x1,y1) –>顶点 , 
     * p2(x2,y2) –>顶点 , 
     * p3(x3,y3) –>原点，
     * s(p1,p2,p3)=(x1-x3)*(y2-y3)-(x2-x3)*(y1-y3)
     * 如果s>0 则说明 这连接这3个点时是按照逆时针的顺序,如果是s<0则说明连接这3个点是按照顺时针的顺序 
     * */
    function getDirection(x2, y2) {
        let x1 = rotateInfo.x;
        let y1 = rotateInfo.y;
        let x3 = rotateInfo.centerX;
        let y3 = rotateInfo.centerY;
        return (x1 - x3) * (y2 - y3) - (x2 -x3) * (y1 - y3); 
    }

    /**
     * 两个向量的夹角公式
     * cos =(x1x2+y1y2)/[√(x1²+y1²)*√(x2²+y2²)]
     * radina = Math.acos(cos) 获取的是弧度值，需转化成角度
     * @param {*} x
     * @param {*} y
     * @param {*} item
     */
    function move(x, y, item) {
        let x1 = (rotateInfo.x - rotateInfo.centerX);
        let y1 = (rotateInfo.y- rotateInfo.centerY);

        var x2 = (x - rotateInfo.centerX);
        var y2 = (y - rotateInfo.centerY);

        let cos = (x1 * x2 + y1*y2) /(getMag(x1, y1) * getMag(x2, y2));
        let radina = Math.acos(cos);
        // 角度
        let angle =  180 / (Math.PI / radina);
        
        let dir = getDirection(x, y);
        
        if (dir < 0) {
            angle = -1 * angle;
        }
        
        item.rotate = rotateInfo.rotate + (angle % 360);
    }

    return {
        start,
        move
    }
}


export default Rotate();
