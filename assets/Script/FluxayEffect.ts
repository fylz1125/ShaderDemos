// Feofox Game
// Author:Lerry
// https://github.com/fylz1125/ShaderDemos
import Fluxay from './FluxayFrag';

const {ccclass, property} = cc._decorator;

@ccclass
export default class FluxayEffect extends cc.Component {
    @property
    mode: number = 0;    
    fragStr: string = null;
    program: cc.GLProgram;
    startTime:number = Date.now();
    time: number = 0;


    onLoad() {
        if (this.mode == 0) {
            this.fragStr = Fluxay.fluxay_frag;
        } else {
            this.fragStr = Fluxay.fluxay_frag_super;
        }
        this.useWater();
    }

    start() {
    }

    useWater() {
        this.program = new cc.GLProgram();
        if (cc.sys.isNative) {
            this.program.initWithString(Fluxay.fluxay_vert, this.fragStr);
        } else {
            this.program.initWithVertexShaderByteArray(Fluxay.fluxay_vert, this.fragStr);
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
        } else {
            let ba = this.program.getUniformLocationForName("time");
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
