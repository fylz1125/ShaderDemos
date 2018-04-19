declare module cc {
    /**
     * 实现WebGL program的类，用来做shader编程
     */
    export class GLProgram{
        /**
         * 实现WebGL program的类，用来做shader编程
         */
        constructor();
        /**
         * 使用顶点shader字符串和片段shader字符串初始化cc.GLProgram
         * @param vertShaderStr 顶点shader字符串
         * @param fragShaderStr 片段shader字符串
         */
        initWithString(vertShaderStr: string, fragShaderStr: string): boolean;

        /**
         * It will add a new attribute to the shader
         * @param attributeName 
         * @param index 
         */
        addAttribute(attributeName: number, index: number);
        /**
         * Initializes the cc.GLProgram with a vertex and fragment with string
         * @param vertShaderStr 
         * @param fragShaderStr 
         */
        initWithVertexShaderByteArray(vertShaderStr: string, fragShaderStr: string):boolean;

        /**
         * 连接 glprogram
         */
        link(): boolean;
        
        /**
         * 这个函数创建4个统一变量即uniform 
         *  cc.macro.UNIFORM_PMATRIX
         *  cc.macro.UNIFORM_MVMATRIX
         *  cc.macro.UNIFORM_MVPMATRIX
         *  cc.macro.UNIFORM_SAMPLER
        */
        updateUniforms();

        /**
         * it will call gl.useProgram()
         */
        use();

        /**
         * calls retrieves the named uniform location for this shader program.
         * @param name 
         */
        getUniformLocationForName(name: string): number;

        /**
         * calls glUniform1f only if the values are different than the previous call for this same shader program.
         * @param location 
         * @param f1 
         */
        setUniformLocationWith1f(location, f1);

        /**
         * calls glUniform2f only if the values are different than the previous call for this same shader program.
         * @param location 
         * @param f1 
         * @param f2 
         */
        setUniformLocationWith2f(location,f1,f2)
    }

    export class GLProgramState{

        static getOrCreateWithGLProgram(program:GLProgram):any;
    }
}