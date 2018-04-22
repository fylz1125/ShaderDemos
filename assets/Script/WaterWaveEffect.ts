// Feofox Game
// Author:Lerry
// https://github.com/fylz1125/ShaderDemos
import WaterFrag from './WaterWaveFrag';
const { ccclass, property } = cc._decorator;

@ccclass
export default class WaterWaveEffect extends cc.Component {

    @property
    isAllChildrenUse: boolean = false;

    program: cc.GLProgram;
    time: number = 0;

    resolution={ x:0.0, y:0.0};

    onLoad() {
        this.enabled = true;
        this.resolution.x = ( this.node.getContentSize().width );
        this.resolution.y = ( this.node.getContentSize().height );
        cc.log('resolution x: ' + this.resolution.x + ' y: ' + this.resolution.y);
        this.userWater();
        
    }

    start() {
    }

    userWater() {
        this.program = new cc.GLProgram();
        if (cc.sys.isNative) {
            this.program.initWithString(WaterFrag.waterwave_vert, WaterFrag.waterwave_frag);
        } else {
            this.program.initWithVertexShaderByteArray(WaterFrag.waterwave_vert, WaterFrag.waterwave_frag);
            this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
        }
        this.program.link();
        this.program.updateUniforms();
        this.program.use();

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this.program);
            glProgram_state.setUniformFloat("time", this.time);
            glProgram_state.setUniformVec2( "resolution", this.resolution );
        } else {
            let res = this.program.getUniformLocationForName( "resolution" );
            let ba = this.program.getUniformLocationForName("time");
            this.program.setUniformLocationWith2f( res, this.resolution.x,this.resolution.y );
            this.program.setUniformLocationWith1f(ba, this.time);
        }

        this.setProgram(this.node.getComponent(cc.Sprite)._sgNode, this.program);
        // this.enabled = true;
    }

    setProgram(node: any, program: any) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }
        var children = node.children;
        if (!children)
            return;

        for (var i = 0; i < children.length; i++) {
            this.setProgram(children[i], program);
        }
    }

    update(dt) {
        this.time += 0.01;
        if (this.program) {
            this.program.use();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this.program);
                glProgram_state.setUniformFloat("time", this.time);
            } else {
                let time = this.program.getUniformLocationForName("time");
                this.program.setUniformLocationWith1f(time, this.time);
            }
        }
    }

    updateParameters() {
        this.time += 0.2;
        this.resolution.x = ( this.node.getContentSize().width );
        this.resolution.y = ( this.node.getContentSize().height );
    }
}
