var _default_vert = require("./ccShader_Default_Vert.js");
var _default_vert_no_mvp = require("./ccShader_Default_Vert_noMVP.js");
var _black_white_frag = require("./ccShader_Avg_Black_White_Frag.js");

var EffectBlackWhite = cc.Class({
    extends: cc.Component,

    properties: {
        isAllChildrenUser: false,
    },

    onLoad: function () {
        this._use();
    },

    _use: function () {
        this._program = new cc.GLProgram();
        if (cc.sys.isNative) {
            cc.log("use native GLProgram")
            this._program.initWithString(_default_vert_no_mvp, _black_white_frag);
            this._program.link();
            this._program.updateUniforms();
        } else {
            this._program.initWithVertexShaderByteArray(_default_vert, _black_white_frag);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);
            this._program.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);
            this._program.link();
            this._program.updateUniforms();
        }
        this.setProgram(this.node._sgNode, this._program);

    },
    setProgram: function (node, program) {

        if (cc.sys.isNative) {
            var glProgram_state = cc.GLProgramState.getOrCreateWithGLProgram(program);
            node.setGLProgramState(glProgram_state);
        } else {
            node.setShaderProgram(program);
        }

        var children = node.children;
        if (!children)
            return;

        if (this.isAllChildrenUser) {
            for (var i = 0; i < children.length; i++) {
                this.setProgram(children[i], program);
            }
        }
    },


});



