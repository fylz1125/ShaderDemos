// Author：lerry（大掌教）
// 详细教程请关注博客和微信公众号
// csdn：https://darkpalm.blog.csdn.net
// 微信公众号ID：darkpalm
// Q群：704391772

import MaterialSingleton from "./MaterialSingleton";
import MaterialManager, { ShaderType, ShaderEffects } from "./MaterialManager";

const { ccclass, property, requireComponent, executeInEditMode } = cc._decorator;

const NeedUpdate = [ShaderType.WaterWave,ShaderType.StartLighting];

@ccclass
@executeInEditMode
@requireComponent(cc.Sprite)
export default class ShaderComponent extends cc.Component {

    @property({ type: cc.Enum(ShaderType), visible: false })
    private _shader: ShaderType = ShaderType.Normal;

    @property({
        type: cc.Enum(ShaderEffects),
        displayName:"着色器"
    })
    get shader() { return this._shader; }
    set shader(type) {
        this._shader = type;
        this._setMaterial();
    }

    private _time = 0;
    private _startIndex:number = Date.now();
    private  _material: MaterialSingleton;
    get material() { return this._material; }

    protected start() {
        this.getComponent(cc.Sprite).setState(cc.Sprite.State.NORMAL);
        this._setMaterial();
        
    }

    protected update(dt) {
        if (!this._material) return;
        this._updateShaderTime(dt);
    }

    private _setMaterial() {
        let shader = this.shader;
        let sprite = this.getComponent(cc.Sprite);
        let material = MaterialManager.getMaterial(sprite, shader);
        this._material = material;
        if (!material) return;
        switch (shader) {
            case ShaderType.WaterWave:
            case ShaderType.StartLighting:
            case ShaderType.Blackhole:
                material.setResolution(this.node.width, this.node.height);
                break;
            default:
                break;
        }
    }

    /**
     * 随时间更新shader
     * @param dt 每帧时间
     */
    private _updateShaderTime(dt) {
        if (NeedUpdate.indexOf(this._shader) >= 0) {
            this._time = (Date.now() - this._startIndex) / 1000;
            this._material.setTime(this._time);
        }
    }
}
