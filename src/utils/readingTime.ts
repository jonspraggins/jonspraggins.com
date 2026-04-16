/**
 * Estimates reading time for a given text body.
 * Average reading speed: 200 wpm.
 */
export function readingTime(text: string): string {
	const words = text.trim().split(/\s+/).length;
	const minutes = Math.ceil(words / 200);
	return `${minutes} min read`;
}
