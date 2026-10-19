package fontys.individual.business.converters;

import fontys.individual.domain.classes.Painting;
import fontys.individual.persistence.entity.ArtEntity;
import lombok.NoArgsConstructor;

@NoArgsConstructor
public class PaintingConverter {
    public static Painting convertToPainting(ArtEntity entity)
    {
        return Painting.builder()
                .id(entity.getId())
                .name(entity.getName())
                .price(entity.getPrice())
                .description(entity.getDescription())
                .length(entity.getLength())
                .width(entity.getWidth())
                .image(entity.getImage())
                .auction(entity.getAuction())
                .sold(entity.getSold())
                .build();
    }

    public static ArtEntity convertToArtEntity(Painting painting)
    {
        return ArtEntity.builder()
                .id(painting.getId())
                .name(painting.getName())
                .price(painting.getPrice())
                .description(painting.getDescription())
                .length(painting.getLength())
                .width(painting.getWidth())
                .image(painting.getImage())
                .auction(painting.getAuction())
                .sold(painting.getSold())
                .build();
    }
}
