import pathUtil from 'path'
import globby from 'globby'
import SpruceError from './errors/SpruceError'

const pluginUtil = {
	async import(args: any[], ...path: string[]) {
		const lookup = pathUtil.join(...path, '**', '*.plugin.[t|j]s')
		const results = globby.sync(lookup)
		const plugins: any[] = []

		const all = results.map(async (path) => {
			const plugin = require(path)

			if (!plugin || !plugin.default) {
				throw new SpruceError({
					code: 'FAILED_TO_LOAD_PLUGIN',
					file: path,
					friendlyMessage: 'You must export your plugin as the default.',
				})
			}

			const result = await plugin.default(...args)
			plugins.push(result)
		})

		await Promise.all(all)

		return plugins
	},
}

export default pluginUtil
