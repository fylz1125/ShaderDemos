const { ccclass, property } = cc._decorator;

@ccclass
export default class Menu extends cc.Component {

    @property({
        type: cc.AudioClip,
        displayName: "背景音乐"
    })
    bgm: cc.AudioClip = null;

    @property({
        displayName: "作者",
        visible: false
    })
    author = "大掌教";

    @property({
        type: cc.Label,
        displayName: "作者"
    })
    authorLb: cc.Label = null;

    @property({
        type: cc.Label,
        displayName: "公众号ID"
    })
    wechatLb: cc.Label = null;


    // 初始化
    onLoad() {
        cc.debug.setDisplayStats(true);
        cc.game.addPersistRootNode(this.node);
        cc.audioEngine.playMusic(this.bgm, true);
        this.authorLb.string = this.author;

        let lbAction = cc.repeatForever(
            cc.sequence(
                cc.scaleTo(1, 1.1),
                cc.scaleTo(1, 1.0),
                cc.scaleTo(1, 0.9),
                cc.scaleTo(1, 1.0)
            )
        );
        let finished = cc.callFunc(function () { 
            this.authorLb.node.runAction(lbAction)
            this.wechatLb.node.runAction(cc.spawn(cc.scaleTo(1,1.0),cc.rotateBy(1,720)));
        }, this);
        let lbSpawn = cc.spawn(cc.scaleTo(1.5, 1.0).easing(cc.easeSineIn()), cc.fadeTo(1.5, 255).easing(cc.easeSineIn()));
        let lbSequence = cc.sequence(lbSpawn, finished,);
        this.authorLb.node.runAction(lbSequence);
    }
    goGlackhole() {
        cc.director.loadScene("Blackhole");
    }


    // 每帧更新函数
    // update(dt) {}
}
