// @ts-ignore
const math = cc.vmath;
const renderEngine = cc.renderer.renderEngine;
const Material = renderEngine.Material;

export default class MaterialSingleton extends Material {
    private static instance: MaterialSingleton = null;
    constructor() {
        super(false);
    }

    public static getInstance(shaderName:string): MaterialSingleton {
        if (!this.instance) {
            this.instance = new MaterialSingleton();
        }
        this.instance.initWithName(shaderName)
        return this.instance;
    }

    private initWithName(shaderName: string) {
        let renderer = renderEngine.renderer;
        let gfx = renderEngine.gfx;

        let pass = new renderer.Pass(shaderName);
        pass.setDepth(false, false);
        pass.setCullMode(gfx.CULL_NONE);
        pass.setBlend(
            gfx.BLEND_FUNC_ADD,
            gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA,
            gfx.BLEND_FUNC_ADD,
            gfx.BLEND_SRC_ALPHA, gfx.BLEND_ONE_MINUS_SRC_ALPHA
        );

        let mainTech = new renderer.Technique(
            ['transparent'],
            [
                { name: 'texture', type: renderer.PARAM_TEXTURE_2D },
                { name: 'pos', type: renderer.PARAM_FLOAT3 },
                { name: 'size', type: renderer.PARAM_FLOAT2 },
                { name: 'iTime', type: renderer.PARAM_FLOAT },
                { name: 'num', type: renderer.PARAM_FLOAT },
                { name: 'resolution', type: renderer.PARAM_FLOAT3 },
            ],
            [pass]
        );

        // @ts-ignore
        this._texture = null;
        // @ts-ignore
        this._pos = { x: 0.0, y: 0.0, z: 0.0 };
        // @ts-ignore
        this._size = { x: 0.0, y: 0.0 };
        // @ts-ignore
        this._time = 0.0;
        // @ts-ignore
        this._num = 0.0;
        // @ts-ignore
        this._resolution = math.vec3.create();
        // @ts-ignore
        this._effect = this.effect = new renderer.Effect(
            [
                mainTech
            ],
            {
                'pos': this._pos,
                'size': this._size,
                'iTime': this._time,
                'num': this._num,
                'resolution': this._resolution
            },
            []
        );
        // @ts-ignore
        this._mainTech = mainTech;
    }

    setTexture(texture) {
        if (this._texture !== texture) {
            // @ts-ignore
            this._texture = texture;
            this._texture.update({
                // 有时候需要反转y轴
                flipY: false,
                // 多级渐进纹理
                mipmap: true
            });
            this._effect.setProperty('texture', texture.getImpl());
            this._texIds['texture'] = texture.getId();
        }
    }

    setPos(x, y, z) {
        this._pos.x = x;
        this._pos.y = y;
        this._pos.z = z;
        this._effect.setProperty('pos', this._pos);
    }

    setSize(x, y) {
        this._size.x = x;
        this._size.y = y;
        this._effect.setProperty('size', this._size);
    }

    setTime(time) {
        // @ts-ignore
        this._time = time;
        this._effect.setProperty('iTime', this._time);
    }

    setNum(num) {
        // @ts-ignore
        this._num = num;
        this._effect.setProperty('num', this._num);
    }

    setResolution(w, h) {
        this._resolution.x = w;
        this._resolution.y = h;
        this._effect.setProperty('resolution', this._resolution);
    }


}