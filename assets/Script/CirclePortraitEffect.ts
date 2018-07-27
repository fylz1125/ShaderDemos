import CirclePortrait from './CirclePortraitFrag';

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Slider)
    cornerSlider: cc.Slider = null;

    program: cc.GLProgram;
    edge = 0.05;

    onLoad() {
        this.edge = this.cornerSlider.progress / 2;
        this.makeCircle();
    }

    start () {

    }

    makeCircle() {
        if (this.program) return;    
        this.program = new cc.GLProgram();
        if (cc.sys.isNative) {
            this.program.initWithString(CirclePortrait.circle_vert, CirclePortrait.circle_frag);
        } else {
            this.program.initWithVertexShaderByteArray(CirclePortrait.circle_vert, CirclePortrait.circle_frag);
            this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
        }
        this.program.link();
        this.program.updateUniforms();
        this.program.use();

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this.program);
            glProgram_state.setUniformFloat('u_edge', this.edge);
        } else {
            let ed = this.program.getUniformLocationForName( "u_edge" );
            this.program.setUniformLocationWith1f(ed, this.edge );
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

    onSliderChange(slider: cc.Slider, eventType: any) {
        this.edge = Number((slider.progress / 2).toFixed(2));
        if (!this.program) return;
        this.program.use();
        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this.program);
            glProgram_state.setUniformFloat("u_edge", this.edge);
        } else {
            let ed = this.program.getUniformLocationForName("u_edge");
            this.program.setUniformLocationWith1f(ed, this.edge);
        }

    }

    // update (dt) {}
}
