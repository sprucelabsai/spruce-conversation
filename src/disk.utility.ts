import { exec } from 'child_process'
import os from 'os'
import pathUtil from 'path'
import fs from 'fs-extra'
import * as uuid from 'uuid'
import { HASH_SPRUCE_DIR } from './constants'

export interface CreateFile {
	/** The relative path from the cwd, without a leading forward slash */
	relativePath: string
	/** The file contents, built with the template data */
	contents: string
}

const diskUtil = {
	writeFile(destination: string, contents: string) {
		fs.outputFileSync(destination, contents)
	},

	readDir(destination: string) {
		return fs.readdirSync(destination)
	},

	readFile(source: string) {
		if (!fs.existsSync(source)) {
			throw new Error(`No file to read at ${source}`)
		}
		return fs.readFileSync(source).toString()
	},

	deleteFile(destination: string) {
		if (fs.existsSync(destination)) {
			fs.removeSync(destination)
		}
	},

	createDir(destination: string) {
		fs.ensureDirSync(destination)
	},

	moveDir(source: string, destination: string) {
		fs.moveSync(source, destination)
	},

	moveFile(source: string, destination: string) {
		fs.moveSync(source, destination)
	},

	async copyDir(source: string, destination: string) {
		this.createDir(destination)
		return new Promise((resolve) => {
			exec(
				`cd ${source} && tar cf - . | (cd ${destination}; tar xf -)`,
				{ maxBuffer: 1024 * 1024 * 5 },
				(err, stdout) => {
					if (err) {
						throw err
					}
					resolve(stdout)
				}
			)
		})
	},

	deleteDir(target: string) {
		const resolved = this.resolvePath(target)
		if (fs.existsSync(resolved)) {
			fs.removeSync(resolved)
		}
	},

	doesFileExist(target: string) {
		const resolved = this.resolvePath(target)
		return fs.existsSync(resolved)
	},

	isDir(target: string) {
		const resolved = this.resolvePath(target)
		if (this.doesDirExist(resolved)) {
			return fs.lstatSync(resolved).isDirectory()
		}

		return false
	},

	isDirPath(path: string) {
		const resolved = this.resolvePath(path)
		if (this.isDir(resolved)) {
			return true
		}

		return pathUtil.extname(resolved).length === 0
	},

	isFile(target: string) {
		const resolved = this.resolvePath(target)
		if (this.doesFileExist(resolved)) {
			return fs.lstatSync(resolved).isFile()
		}

		return false
	},

	doesDirExist(target: string) {
		const resolved = this.resolvePath(target)
		return fs.existsSync(resolved)
	},

	resolveHashSprucePath(cwd: string, ...filePath: string[]): string {
		const parts = cwd.split(pathUtil.sep)

		do {
			const path = pathUtil.join('/', ...parts, HASH_SPRUCE_DIR)
			if (this.doesDirExist(path)) {
				return this.resolvePath(path, ...filePath)
			}
			parts.pop()
		} while (parts.length > 0)

		throw new Error(`Hash Spruce directory not found at ${cwd}`)
	},

	doesHashSprucePathExist(cwd: string, ...filePath: string[]): boolean {
		try {
			this.resolveHashSprucePath(cwd, ...filePath)
			return true
		} catch {
			return false
		}
	},

	isFileDifferent(destination: string, contents: string) {
		const currentContents = this.readFile(destination)
		return currentContents != contents
	},

	resolvePath(cwd: string, ...filePath: string[]): string {
		let builtPath = pathUtil.join(...filePath)

		if (builtPath[0] !== '/') {
			// Relative to the cwd
			if (builtPath.substr(0, 2) === './') {
				builtPath = builtPath.substr(1)
			}

			builtPath = pathUtil.join(cwd, builtPath)
		}

		if (builtPath.search('#') > -1) {
			builtPath = builtPath.replace('#spruce', HASH_SPRUCE_DIR)
		}

		return builtPath
	},

	createTempDir(...files: string[]) {
		const tmpDir = os.tmpdir()
		const targetDir = pathUtil.join(tmpDir, ...files)
		this.createDir(targetDir)

		return targetDir
	},

	createRandomTempDir() {
		return this.createTempDir(uuid.v4())
	},
}
export default diskUtil
