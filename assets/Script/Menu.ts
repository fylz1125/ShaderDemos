const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Label)
    instructionLabel: cc.Label = null;

    @property(cc.ScrollView)
    readme: cc.ScrollView = null;

    @property(cc.Label)
    sceneName: cc.Label = null;

    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;

    currentSceneIndex: number = 0;
    sceneList: string[] = new Array<string>();

    // 初始化
    onLoad() {
        cc.director.setDisplayStats(true);
        cc.game.addPersistRootNode(this.node);

        cc.audioEngine.playMusic(this.bgm, true);
        // 初始化场景数组
        let scenes = cc.game._sceneInfos;//隐藏属性，拿过来用
        let amazing: string[] = new Array<string>();
        for (let i = 0; i < scenes.length; ++i){
            let url = <string>scenes[i].url;
            if (url.search(/AmazingEffects/) == -1) {
                let tmp = url.replace('db://assets/Scene/', '').replace('.fire', '');
                if (tmp === 'StartScene') {
                    this.sceneList.unshift(tmp);
                } else {
                    this.sceneList.push(tmp);
                }
            } else {
                let tmp = url.replace('db://assets/Scene/AmazingEffects/', '').replace('.fire', '');
                amazing.push(tmp);
            }
        }
        this.sceneList = this.sceneList.concat(amazing);
        
        // 说明文档必须要和场景同名
        let currentSceneName = this.sceneList[this.currentSceneIndex];
        this.loadInstruction(currentSceneName);
        this.setSceneName(currentSceneName);
    }

    loadInstruction(url: string) {
        let self = this;
        cc.loader.loadRes('readme/' + url, function(err, txt) {
            if (err) {
                self.instructionLabel.string = '暂无说明文档，后续补充';
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
        this.setSceneName(scene);
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
        this.setSceneName(scene);
        cc.director.loadScene(scene,this.onLoadSceneFinish.bind(this));
    }
    
    setSceneName(name:string) {
        this.sceneName.string = name;
    }


    // 每帧更新函数
    // update(dt) {}
}
