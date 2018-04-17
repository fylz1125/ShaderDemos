const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    currentSceneName: string = '';

    @property(cc.Label)
    instructionLabel: cc.Label = null;

    @property(cc.ScrollView)
    readme: cc.ScrollView = null;

    // 初始化
    onLoad() {
        cc.director.setDisplayStats(true);
        cc.game.addPersistRootNode(this.node);

        this.loadInstruction(this.currentSceneName);
        cc.log('scene name: ' + cc.director.getScene().name);
        
    }

    loadInstruction(url: string) {
        let self = this;
        cc.loader.loadRes('readme/' + url, function(err, txt) {
            if (err) {
                cc.log('加载说明文件出错');
                return;
            }
            self.instructionLabel.string = txt;
        });
    }

    showReadme() {
        this.readme.node.active = !this.readme.node.active;
        if (this.readme.node.active) {
            this.readme.scrollToTop();
        }
    }

    nextScene() {
        cc.log('next scene');
        cc.director.loadScene('helloworld',this.onLoadSceneFinish.bind(this));
    }

    onLoadSceneFinish() {
        this.currentSceneName = cc.director.getScene().name;
        this.loadInstruction(this.currentSceneName);
    }

    preScene() {
        // cc.log('previous scene');
        cc.log('current scene ' + this.currentSceneName);
    }


    // 每帧更新函数
    // update(dt) {}
}
