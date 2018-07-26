import CirclePortrait from './CirclePortraitFrag';

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    program: cc.GLProgram;
    size = { x: 0.0, y: 0.0 };
    radiusRatio = { x: 20.0, y: 20.0 };
    deviation = { x: 5.0, y: 5.0 };
    onLoad() {
        this.size.x = ( this.node.getContentSize().width );
        this.size.y = (this.node.getContentSize().height);
        cc.log('size is x:' + this.size.x + ' y:' + this.size.y);
        this.radiusRatio.x = 20.0;
        this.radiusRatio.y = 20.0;
        this.deviation.x = 10.0;
        this.deviation.y = 10.0;
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
            glProgram_state.setUniformVec2("radiusRatio", this.radiusRatio);
            glProgram_state.setUniformVec2("size", this.size);
            glProgram_state.setUniformVec2( "deviation", this.deviation );
        } else {
            let rd = this.program.getUniformLocationForName( "radiusRatio" );
            let sz = this.program.getUniformLocationForName("size");
            let de = this.program.getUniformLocationForName("deviation");
            this.program.setUniformLocationWith2f(rd, this.radiusRatio.x,this.radiusRatio.y );
            this.program.setUniformLocationWith2f(sz, this.size.x, this.size.y);
            this.program.setUniformLocationWith2f(de, this.deviation.x,this.deviation.y);
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

    // update (dt) {}
}
