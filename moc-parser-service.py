from flask import Flask, request, jsonify
from flask_cors import CORS
import struct
import json
import os

app = Flask(__name__)
CORS(app)

# MOC3 Header structure
MOC3_HEADER = {
    'magic': 4,  # "MOC3"
    'version': 1,  # byte
    'unused': 3,  # 3 bytes
    'flags': 1,  # byte
}

class MocParser:
    def __init__(self, file_path):
        self.file_path = file_path
        self.data = None
        self.header = {}
        self.parts = []
        
    def parse(self):
        try:
            with open(self.file_path, 'rb') as f:
                self.data = f.read()
            
            # Check if it's MOC3
            if self.data[:4] == b'MOC3':
                return self._parse_moc3()
            # Check if it's MOC (v2)
            elif self.data[:3] == b'moc':
                return self._parse_moc2()
            else:
                return {'error': 'Unknown file format'}
                
        except Exception as e:
            return {'error': str(e)}
    
    def _parse_moc3(self):
        """Parse MOC3 (Cubism 3.0+) files"""
        result = {
            'version': 'MOC3',
            'header': {},
            'sections': [],
            'canvas_info': {}
        }
        
        # Parse header
        offset = 0
        result['header']['magic'] = self.data[offset:offset+4].decode('ascii')
        offset += 4
        
        result['header']['version'] = self.data[offset]
        offset += 1
        
        # Skip unused bytes
        offset += 3
        
        result['header']['flags'] = self.data[offset]
        offset += 1
        
        # Parse section count (at offset 0x40)
        offset = 0x40
        section_count = struct.unpack('<I', self.data[offset:offset+4])[0]
        offset += 4
        
        # Parse sections
        for i in range(min(section_count, 20)):  # Limit to prevent too many sections
            section = {}
            section['offset'] = struct.unpack('<I', self.data[offset:offset+4])[0]
            offset += 4
            section['size'] = struct.unpack('<I', self.data[offset:offset+4])[0]
            offset += 4
            result['sections'].append(section)
        
        # Try to extract canvas info from known offsets
        try:
            # Canvas dimensions often at specific offsets
            canvas_offset = 0x100  # Common offset for canvas info
            if len(self.data) > canvas_offset + 8:
                result['canvas_info']['width'] = struct.unpack('<f', self.data[canvas_offset:canvas_offset+4])[0]
                result['canvas_info']['height'] = struct.unpack('<f', self.data[canvas_offset+4:canvas_offset+8])[0]
        except:
            pass
            
        return result
    
    def _parse_moc2(self):
        """Parse MOC (Cubism 2.0) files"""
        result = {
            'version': 'MOC2',
            'header': {},
            'model_info': {},
            'parts': []
        }
        
        # Parse header
        offset = 0
        result['header']['magic'] = self.data[offset:offset+3].decode('ascii')
        offset += 3
        
        result['header']['version'] = self.data[offset]
        offset += 1
        
        # Parse model dimensions (usually at offset 0x08)
        offset = 0x08
        if len(self.data) > offset + 8:
            result['model_info']['width'] = struct.unpack('<f', self.data[offset:offset+4])[0]
            result['model_info']['height'] = struct.unpack('<f', self.data[offset+4:offset+8])[0]
        
        # Try to find part count
        offset = 0x20
        if len(self.data) > offset + 4:
            part_count = struct.unpack('<I', self.data[offset:offset+4])[0]
            result['model_info']['part_count'] = part_count
            
        return result

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'service': 'Live2D MOC Parser Service'
    })

@app.route('/parse-moc', methods=['POST'])
def parse_moc():
    try:
        data = request.get_json()
        file_path = data.get('file_path')
        
        if not file_path:
            return jsonify({
                'success': False,
                'error': 'file_path is required'
            }), 400
            
        if not os.path.exists(file_path):
            return jsonify({
                'success': False,
                'error': f'File not found: {file_path}'
            }), 404
            
        parser = MocParser(file_path)
        result = parser.parse()
        
        if 'error' in result:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 500
            
        return jsonify({
            'success': True,
            'data': result,
            'model_type': result['version']
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print('Starting Live2D MOC Parser Service on http://localhost:8082')
    app.run(host='127.0.0.1', port=8082, debug=True)