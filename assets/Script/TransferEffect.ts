import Transfer from './TransferFrag';
const { ccclass, property } = cc._decorator;

@ccclass
export default class TransferEffect extends cc.Component {


    @property
    isAllChildrenUse: boolean = false;

    program: cc.GLProgram;
    time: number = 0;

    start() {
        // init logic
        this.enabled = false;
    }

    useShader() {
        let bgSp: cc.Sprite = this.node.getComponent(cc.Sprite);
        this.program = new cc.GLProgram();
        if (!cc.sys.isNative) {
            this.program.initWithVertexShaderByteArray(Transfer.vert, Transfer.frag);
            this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
        } else {
            this.program.initWithString(Transfer.vert, Transfer.frag);
        }
        this.program.link();
        this.program.updateUniforms();
        this.program.use();

        if (!cc.sys.isNative) {
            let time = this.program.getUniformLocationForName("time");
            this.program.setUniformLocationWith1f(time, this.time);
        } else {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this.program);
            glProgram_state.setUniformFloat("time", this.time);
        }
        // bgSp._sgNode.setShaderProgram(this.program);
        // this.enabled = true;
        if (this.isAllChildrenUse) {
            this.setProgram(this.node._sgNode, this.program);
        } else {
            this.setProgram(this.node.getComponent(cc.Sprite)._sgNode, this.program);
        }
        this.enabled = true;
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
        this.time += 0.02;
        if (this.program) {
            this.program.use();
            if (!cc.sys.isNative) {
                let time = this.program.getUniformLocationForName("time");
                this.program.setUniformLocationWith1f(time, this.time);
            } else {
                var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(this.program);
                glProgram_state.setUniformFloat("time", this.time);
            }
        }
    }
}
