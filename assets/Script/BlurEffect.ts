import VertAndFrag from './VertAndFrag';
import BlursFrag from './BlursFrag';
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    blurMode: number = 0;
    

    program: cc.GLProgram;

    // 模糊半径
    glowRange: number = 2.0;
    // 动感模糊角度
    glowExpand: number = 1.2;



    onLoad() {
        this.userBlur();

    }

    start () {

    }

    userBlur() {
        this.program = new cc.GLProgram();
        if (cc.sys.isNative) {
            this.program.initWithString(VertAndFrag.default_vert, BlursFrag.blursFrag);
        } else {
            this.program.initWithVertexShaderByteArray(VertAndFrag.default_vert, BlursFrag.blursFrag);
            this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
        }
        this.program.link();
        this.program.updateUniforms();
        this.program.use();

        if (cc.sys.isNative) { 
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this.program);
            glProgram_state.setUniformFloat("mode", this.blurMode);
            glProgram_state.setUniformFloat("GlowRange", this.glowRange);
            glProgram_state.setUniformFloat("GlowExpand", this.glowExpand);
        } else {
            let mode = this.program.getUniformLocationForName("mode");
            let range = this.program.getUniformLocationForName("GlowRange");
            let expand = this.program.getUniformLocationForName("GlowExpand");
            
            this.program.setUniformLocationWith1f(mode, this.blurMode);
            this.program.setUniformLocationWith1f(range, this.glowRange);
            this.program.setUniformLocationWith1f(expand, this.glowExpand);
        }
        this.setProgram(this.node.getComponent(cc.Sprite)._sgNode, this.program);
    }

    setProgram(node:any, program:any) {
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }
    }


    // update (dt) {}
}
