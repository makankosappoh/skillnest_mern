export default function StickerCard({ children, className = '', as: Tag = 'div', ...rest }) {
  return (
    <Tag className={`card-sticker ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
