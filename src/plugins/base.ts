import type { PluginOption } from '../../types/plugin'
import Lifecycle, { LifeCycleEnum } from './lifecycle'
import ShortCut from './shortCut'
abstract class PluginBase {
    shortCut = ShortCut
    lifecycle = Lifecycle
    lifecycleEnum = LifeCycleEnum

    abstract setup(option: PluginOption): void
}

export default PluginBase
