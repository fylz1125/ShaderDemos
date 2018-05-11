import Gray from './GrayFrag';
const { ccclass, property } = cc._decorator

@ccclass
export default class GrayEffect extends cc.Component {
    @property
    isAllChildrenUse: boolean = false;

    program: cc.GLProgram;// ShaderProgram

    onLoad() {
        this.grayShader();
    }

    // 变灰shader
    grayShader() {
        this.program = new cc.GLProgram();
        if (cc.sys.isNative) {
            this.program.initWithString(Gray.default_vert, Gray.gray_frag);
            this.program.link();
            this.program.updateUniforms();
        } else {
            this.program.initWithVertexShaderByteArray(Gray.default_vert, Gray.gray_frag);
            this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this.program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            this.program.link();
            this.program.updateUniforms();
        }
        if (this.isAllChildrenUse) {
            this.setProgram(this.node._sgNode, this.program);
        } else {
            this.setProgram(this.node.getComponent(cc.Sprite)._sgNode, this.program);
        }

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

    // 恢复默认shader
    resetProgram(node: cc.Node) {
        node.getComponent(cc.Sprite)._sgNode.setState(0);
        var children = node.children;
        if (!children)
            return;
        for (var i = 0; i < children.length; i++) {
            this.resetProgram(children[i]);
        }
        
    }

    resetShader() {
        if (this.isAllChildrenUse) {
            this.resetProgram(this.node);
        } else {
            this.node.getComponent(cc.Sprite)._sgNode.setState(0);
        }
    }
}