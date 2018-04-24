const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    currentSceneIndex: number = 0;

    @property(cc.Label)
    instructionLabel: cc.Label = null;

    @property(cc.ScrollView)
    readme: cc.ScrollView = null;

    sceneList: string[] = ['GrayEffect','TransferEffect','GaussBlurs','WaterWave','FluxayEffect'];

    // 初始化
    onLoad() {
        cc.director.setDisplayStats(true);
        cc.game.addPersistRootNode(this.node);

        let currentSceneName = this.sceneList[this.currentSceneIndex];
        this.loadInstruction(currentSceneName);
        
    }

    loadInstruction(url: string) {
        let self = this;
        cc.loader.loadRes('readme/' + url, function(err, txt) {
            if (err) {
                self.instructionLabel.string = '暂无相关文档';
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
        this.currentSceneIndex++;
        if (this.currentSceneIndex >= this.sceneList.length) {
            this.currentSceneIndex = this.sceneList.length - 1;
            return;
        }
        let scene = this.sceneList[this.currentSceneIndex];
        cc.director.loadScene(scene,this.onLoadSceneFinish.bind(this));
    }

    onLoadSceneFinish() {
        let rdfile = this.sceneList[this.currentSceneIndex];
        this.loadInstruction(rdfile);
    }

    preScene() {
        this.currentSceneIndex--;
        if (this.currentSceneIndex < 0) {
            this.currentSceneIndex = 0;
            return;
        }
        let scene = this.sceneList[this.currentSceneIndex];
        cc.director.loadScene(scene,this.onLoadSceneFinish.bind(this));
    }


    // 每帧更新函数
    // update(dt) {}
}
