// Feofox Game
// Author:Lerry
// https://github.com/fylz1125/ShaderDemos
import WaterWave from './WaterWaveFrag';
const { ccclass, property } = cc._decorator;

@ccclass
export default class WaterWaveEffect extends cc.Component {

    program: cc.GLProgram;
    startTime:number = Date.now();
    time: number = 0;

    resolution={ x:0.0, y:0.0};

    onLoad() {
        this.resolution.x = ( this.node.getContentSize().width );
        this.resolution.y = ( this.node.getContentSize().height );
        this.useWater();
        
    }

    start() {
    }

    useWater() {
        if (this.program) return;
        this.program = new cc.GLProgram();
        if (cc.sys.isNative) {
            this.program.initWithString(WaterWave.waterwave_vert, WaterWave.waterwave_frag);
        } else {
            this.program.initWithVertexShaderByteArray(WaterWave.waterwave_vert, WaterWave.waterwave_frag);
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
    }

    setProgram(node: any, program: any) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }
    }

    update(dt) {
        this.time = (Date.now() - this.startTime) / 1000;
        if (this.program) {
            this.program.use();
            if (cc.sys.isNative) {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this.program);
                glProgram_state.setUniformFloat("time", this.time);
            } else {
                let ct = this.program.getUniformLocationForName("time");
                this.program.setUniformLocationWith1f(ct, this.time);
            }
        }
    }
}
