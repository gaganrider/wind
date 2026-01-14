import { useState, useRef } from 'react';
import { Button, Card, CardBody, Textarea, Checkbox } from '@/ui';

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
}

const platforms = [
  { id: 'twitter', name: 'Twitter / X', icon: '𝕏', color: 'bg-black' },
  { id: 'facebook', name: 'Facebook', icon: 'f', color: 'bg-blue-600' },
  { id: 'instagram', name: 'Instagram', icon: '📷', color: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'in', color: 'bg-blue-700' },
];

export default function CreatePost() {
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newMedia: MediaFile[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
    }));

    setMediaFiles((prev) => [...prev, ...newMedia]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeMedia = (id: string) => {
    setMediaFiles((prev) => {
      const file = prev.find((m) => m.id === id);
      if (file) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter((m) => m.id !== id);
    });
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSubmit = () => {
    console.log({
      content,
      mediaFiles: mediaFiles.map((m) => m.file),
      platforms: selectedPlatforms,
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Post</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Form */}
        <div className="space-y-6">
          {/* Content Input */}
          <Card>
            <CardBody>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Post Content</h2>
              <Textarea
                placeholder="What's on your mind? Write your post content here..."
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">{content.length} characters</span>
                <span className="text-sm text-gray-500">
                  {content.length > 280 && (
                    <span className="text-yellow-600">Exceeds Twitter limit</span>
                  )}
                </span>
              </div>
            </CardBody>
          </Card>

          {/* Media Upload */}
          <Card>
            <CardBody>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Media</h2>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="media-upload"
              />
              <label
                htmlFor="media-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <svg
                  className="w-8 h-8 text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm text-gray-600">Click to upload images or videos</span>
                <span className="text-xs text-gray-400 mt-1">PNG, JPG, GIF, MP4 up to 10MB</span>
              </label>

              {/* Media Preview Grid */}
              {mediaFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {mediaFiles.map((media) => (
                    <div key={media.id} className="relative group">
                      {media.type === 'image' ? (
                        <img
                          src={media.preview}
                          alt="Upload preview"
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ) : (
                        <video
                          src={media.preview}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      )}
                      <button
                        onClick={() => removeMedia(media.id)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      {media.type === 'video' && (
                        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
                          Video
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          {/* Platform Selection */}
          <Card>
            <CardBody>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Platforms</h2>
              <div className="space-y-3">
                {platforms.map((platform) => (
                  <div
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedPlatforms.includes(platform.id)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center text-white font-bold`}>
                      {platform.icon}
                    </div>
                    <span className="ml-3 font-medium text-gray-900">{platform.name}</span>
                    <div className="ml-auto">
                      <Checkbox
                        checked={selectedPlatforms.includes(platform.id)}
                        onChange={() => togglePlatform(platform.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Submit Button */}
          <Button
            fullWidth
            size="lg"
            disabled={!content.trim() || selectedPlatforms.length === 0}
            onClick={handleSubmit}
          >
            {selectedPlatforms.length > 0
              ? `Post to ${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? 's' : ''}`
              : 'Select platforms to post'}
          </Button>
        </div>

        {/* Right Side - Preview */}
        <div className="space-y-6">
          <Card>
            <CardBody>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>

              {selectedPlatforms.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <p>Select a platform to see preview</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedPlatforms.map((platformId) => {
                    const platform = platforms.find((p) => p.id === platformId);
                    if (!platform) return null;

                    return (
                      <div key={platformId} className="border border-gray-200 rounded-lg overflow-hidden">
                        {/* Platform Header */}
                        <div className="flex items-center p-3 bg-gray-50 border-b border-gray-200">
                          <div className={`w-8 h-8 ${platform.color} rounded-lg flex items-center justify-center text-white text-sm font-bold`}>
                            {platform.icon}
                          </div>
                          <span className="ml-2 font-medium text-gray-900">{platform.name}</span>
                        </div>

                        {/* Post Preview */}
                        <div className="p-4">
                          {/* User Info */}
                          <div className="flex items-center mb-3">
                            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                              U
                            </div>
                            <div className="ml-3">
                              <p className="font-semibold text-gray-900 text-sm">Your Name</p>
                              <p className="text-xs text-gray-500">Just now</p>
                            </div>
                          </div>

                          {/* Content */}
                          <p className="text-gray-800 whitespace-pre-wrap mb-3">
                            {content || <span className="text-gray-400 italic">Your post content will appear here...</span>}
                          </p>

                          {/* Media Preview */}
                          {mediaFiles.length > 0 && (
                            <div className={`grid gap-1 rounded-lg overflow-hidden ${
                              mediaFiles.length === 1 ? 'grid-cols-1' :
                              mediaFiles.length === 2 ? 'grid-cols-2' :
                              mediaFiles.length === 3 ? 'grid-cols-2' :
                              'grid-cols-2'
                            }`}>
                              {mediaFiles.slice(0, 4).map((media, index) => (
                                <div
                                  key={media.id}
                                  className={`relative ${
                                    mediaFiles.length === 3 && index === 0 ? 'row-span-2' : ''
                                  }`}
                                >
                                  {media.type === 'image' ? (
                                    <img
                                      src={media.preview}
                                      alt="Preview"
                                      className={`w-full object-cover ${
                                        mediaFiles.length === 1 ? 'max-h-64' : 'h-32'
                                      }`}
                                    />
                                  ) : (
                                    <video
                                      src={media.preview}
                                      className={`w-full object-cover ${
                                        mediaFiles.length === 1 ? 'max-h-64' : 'h-32'
                                      }`}
                                      controls
                                    />
                                  )}
                                  {mediaFiles.length > 4 && index === 3 && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                      <span className="text-white text-xl font-bold">
                                        +{mediaFiles.length - 4}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Engagement Preview */}
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-gray-500 text-sm">
                            <button className="flex items-center hover:text-blue-500">
                              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              Like
                            </button>
                            <button className="flex items-center hover:text-blue-500">
                              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              Comment
                            </button>
                            <button className="flex items-center hover:text-blue-500">
                              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                              </svg>
                              Share
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
