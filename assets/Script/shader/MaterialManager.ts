// Author：lerry（大掌教）
// 详细教程请关注博客和微信公众号
// csdn：https://darkpalm.blog.csdn.net
// 微信公众号ID：darkpalm
// Q群：704391772

// import ShaderLab from "./ShaderLab";
import ShaderFSH from "./ShaderFSH";
import MaterialSingleton from "./MaterialSingleton";
/**
 * 定义材质类型
 */
export enum ShaderType {
    // 系统自带
    Normal = -2,
    // 系统自带
    Gray,
    // 自定义开始
    GrayScaling,
    WaterWave,
    StartLighting,
    Blackhole
}

/**
 * 定义个中文的，看起来舒爽一点
 * 两个枚举要配套使用
 */
export let ShaderEffects = cc.Enum({
    正常:-2,
    灰色: -1,
    灰度图: 0,
    水波: 1,
    闪电: 2,
    黑洞照片:3
})

export default class MaterialManager {
    /**
     * 获取一个材质
     * @param sprite 精灵 
     * @param shader shader类型
     */
    static getMaterial(sprite: cc.Sprite, shader: ShaderType): MaterialSingleton {
        if (cc.game.renderType === cc.game.RENDER_TYPE_CANVAS) {
            cc.warn("Shader not surpport for canvas");
            return;
        }
        if (!sprite || !sprite.spriteFrame) {
            return;
        }
        if (shader > ShaderType.Gray) {
            let name = ShaderType[shader];
            let lab = ShaderFSH[shader as number];
            if (!lab) {
                console.warn('Shader not defined', name);
                return;
            }
            cc.dynamicAtlasManager.enabled = false;
            let material = MaterialSingleton.getInstance(name);
            let texture = sprite.spriteFrame.getTexture();
            material.setTexture(texture);
            material.updateHash();
            let sp = sprite as any;
            sp._material = material;
            sp._renderData._material = material;
            sp._state = shader;
            return material;
        }
        else {
            // 系统自带normal和gray
            sprite.setState(shader+2);
        }
    }
}