const { ccclass, property } = cc._decorator;

@ccclass
export default class EffectManager extends cc.Component {

    @property
    fragShader: string = 'lightcircle';
    
    default_vert = `
    attribute vec4 a_position;
    attribute vec2 a_texCoord;
    attribute vec4 a_color;
    varying vec2 v_texCoord;
    varying vec4 v_fragmentColor;
    void main()
    {
        gl_Position = CC_PMatrix * a_position;
        v_fragmentColor = a_color;
        v_texCoord = a_texCoord;
    }
    `;

    program: cc.GLProgram;
    frag_glsl: string = '';
    startTime:number = Date.now();
    time: number = 0;
    resolution={ x:0.0, y:0.0};
    // 初始化
    onLoad() {
        cc.director.setDisplayStats(true);
        this.resolution.x = (this.node.getContentSize().width );
        this.resolution.y = (this.node.getContentSize().height);
        let self = this;
        cc.loader.loadRes(this.fragShader, function (err, data) {
            if (err)
                cc.log(err);
            else {
                self.frag_glsl = data;
                self.useShader();
            }
        });
    }

    useShader() {
        this.program = new cc.GLProgram(); 
        if (cc.sys.isNative) {
            this.program.initWithString(this.default_vert, this.frag_glsl);
        } else {
            this.program.initWithVertexShaderByteArray(this.default_vert, this.frag_glsl);
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
            let ba = this.program.getUniformLocationForName("time");
            let res = this.program.getUniformLocationForName( "resolution" );
            this.program.setUniformLocationWith1f(ba, this.time);
            this.program.setUniformLocationWith2f( res, this.resolution.x,this.resolution.y );
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

    updateParameters() {
        this.time = (Date.now() - this.startTime) / 1000;
    }
    // 每帧更新函数
    update(dt) {
        this.updateParameters();
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
